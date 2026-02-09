const axios = require("axios");
const logger = require("../../common/logger");
const Sentry = require("../../connections/sentry");
const { valarHigh } = require("../../connections/mongo");
const mongoose = require("fit/mongo").mongoose;

const connection = valarHigh;

// Constants
const DeviceCategory = {
    SMALL: "SMALL",
    MEDIUM: "MEDIUM",
    LARGE: "LARGE",
};

const PLP_DIMENSIONS = {
    [DeviceCategory.SMALL]: 120,
    [DeviceCategory.MEDIUM]: 140,
    [DeviceCategory.LARGE]: 200,
};

const PDP_DIMENSIONS = {
    [DeviceCategory.SMALL]: 360,
    [DeviceCategory.MEDIUM]: 420,
    [DeviceCategory.LARGE]: 600,
};

const CONCURRENCY_LIMIT = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Generates 6 URLs from a single original URL
 * @param {string} originalUrl - The original image URL
 * @returns {Array<string>} Array of 6 transformed URLs
 */
const generateImageUrls = (originalUrl) => {
    const urls = [];
    
    // Replace "original" with resize transformations
    // PLP URLs with dpr=2
    Object.values(PLP_DIMENSIONS).forEach((dimension) => {
        const plpUrl = originalUrl.replace(
            "/original/",
            `/t.resize(w:${dimension})/`
        );
        urls.push(`${plpUrl}?dpr=2`);
    });
    
    // PDP URLs with dpr=3
    Object.values(PDP_DIMENSIONS).forEach((dimension) => {
        const pdpUrl = originalUrl.replace(
            "/original/",
            `/t.resize(w:${dimension})/`
        );
        urls.push(`${pdpUrl}?dpr=3`);
    });
    
    return urls;
};

/**
 * Fetches documents from sku_image_mapping collection by Object IDs
 * @param {Array<string>} objectIds - Array of MongoDB Object ID strings
 * @returns {Promise<Array>} Array of documents
 */
const fetchDocumentsFromCollection = async (objectIds) => {
    const collection = connection.db.collection("sku_image_mapping");
    const mongoObjectIds = objectIds.map((id) => 
        mongoose.Types.ObjectId.createFromHexString(id)
    );
    
    const documents = await collection.find({
        _id: { $in: mongoObjectIds },
    }).toArray();
    
    logger.info("Fetched documents from sku_image_mapping", {
        requested: objectIds.length,
        found: documents.length,
    });
    
    return documents;
};

/**
 * Extracts image URLs from a document
 * @param {Object} document - Document from sku_image_mapping collection
 * @returns {Array<Object>} Array of {url, variantKey, originalUrl} objects
 */
const extractImageUrls = (document) => {
    const urls = [];
    
    // Find all keys that match pattern like "JM1251", "JM1256", etc.
    Object.keys(document).forEach((key) => {
        if (key.startsWith("JM1251") && Array.isArray(document[key])) {
            document[key].forEach((originalUrl) => {
                if (typeof originalUrl === "string" && originalUrl.trim()) {
                    urls.push({
                        originalUrl: originalUrl.trim(),
                        variantKey: key,
                        documentId: document._id.toString(),
                        sku: document.sku,
                        brand_org: document.brand_org,
                    });
                }
            });
        }
    });
    
    return urls;
};

/**
 * Makes HTTP request to warmup URL with retry logic
 * @param {string} url - URL to fetch
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} Result object with success/error info
 */
const warmupUrl = async (url, retryCount = 0) => {
    try {
        const response = await axios.head(url, {
            timeout: REQUEST_TIMEOUT,
            validateStatus: (status) => status < 500, // Don't throw on 4xx errors
        });
        
        if (response.status >= 200 && response.status < 400) {
            return { success: true, url, status: response.status };
        } else {
            return {
                success: false,
                url,
                error: `HTTP ${response.status}`,
                status: response.status,
            };
        }
    } catch (error) {
        const isRateLimit = 
            error.response?.status === 429 ||
            error.code === "ECONNRESET" ||
            error.code === "ETIMEDOUT";
        
        if (isRateLimit && retryCount < MAX_RETRIES) {
            const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount);
            logger.warn("Rate limit hit, retrying", {
                url,
                retryCount: retryCount + 1,
                delay,
            });
            
            await new Promise((resolve) => setTimeout(resolve, delay));
            return warmupUrl(url, retryCount + 1);
        }
        
        return {
            success: false,
            url,
            error: error.message || "Unknown error",
            status: error.response?.status || null,
            isRateLimit,
        };
    }
};

/**
 * Processes URLs in batches with concurrency limit
 * @param {Array<Object>} urlObjects - Array of URL objects with metadata
 * @returns {Promise<Object>} Results with success and error arrays
 */
const processUrlsInBatches = async (urlObjects) => {
    const results = {
        successful: [],
        failed: [],
    };
    
    // Process in batches of CONCURRENCY_LIMIT
    for (let i = 0; i < urlObjects.length; i += CONCURRENCY_LIMIT) {
        const batch = urlObjects.slice(i, i + CONCURRENCY_LIMIT);
        
        logger.info("Processing URL batch", {
            batchStart: i + 1,
            batchEnd: Math.min(i + CONCURRENCY_LIMIT, urlObjects.length),
            total: urlObjects.length,
        });
        
        const batchPromises = batch.map((urlObj) => warmupUrl(urlObj.url));
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
            const urlObj = batch[index];
            if (result.status === "fulfilled") {
                const warmupResult = result.value;
                if (warmupResult.success) {
                    results.successful.push({
                        ...urlObj,
                        status: warmupResult.status,
                    });
                } else {
                    results.failed.push({
                        ...urlObj,
                        error: warmupResult.error,
                        status: warmupResult.status,
                        isRateLimit: warmupResult.isRateLimit,
                    });
                }
            } else {
                results.failed.push({
                    ...urlObj,
                    error: result.reason?.message || "Promise rejected",
                });
            }
        });
        
        // Log batch progress
        logger.info("Batch processing completed", {
            batchStart: i + 1,
            successful: results.successful.length,
            failed: results.failed.length,
        });
    }
    
    return results;
};

/**
 * Logs errors to sku_image_mapping_error_logs collection
 * @param {Object} document - Original document
 * @param {Array<Object>} failedUrls - Array of failed URL objects
 */
const logErrorsToCollection = async (document, failedUrls) => {
    if (failedUrls.length === 0) return;
    
    try {
        const errorCollection = connection.db.collection("sku_image_mapping_error_logs");
        
        const errorLog = {
            document_id: document._id,
            sku: document.sku,
            brand_org: document.brand_org,
            vertical: document.vertical,
            grouped_sku: document.grouped_sku,
            failed_urls: failedUrls.map((urlObj) => ({
                url: urlObj.url,
                original_url: urlObj.originalUrl,
                variant_key: urlObj.variantKey,
                error: urlObj.error,
                status: urlObj.status,
                is_rate_limit: urlObj.isRateLimit || false,
            })),
            total_failed: failedUrls.length,
            created_at: new Date(),
        };
        
        await errorCollection.insertOne(errorLog);
        
        logger.info("Logged errors to sku_image_mapping_error_logs", {
            document_id: document._id.toString(),
            failed_count: failedUrls.length,
        });
    } catch (error) {
        logger.error("Error logging to error collection", {
            error: error.message,
            stack: error.stack,
            document_id: document._id?.toString(),
        });
        Sentry.captureException(error);
    }
};

/**
 * Updates metrics in the metrics collection
 * @param {Object} metrics - Metrics to update
 */
const updateMetrics = async (metrics) => {
    try {
        const metricsCollection = connection.db.collection("jiomart_image_warmup_metrics");
        
        // Get or create metrics document
        const existingMetrics = await metricsCollection.findOne({});
        
        const updateData = {
            total_skus_processed: (existingMetrics?.total_skus_processed || 0) + metrics.skusProcessed,
            total_urls_processed: (existingMetrics?.total_urls_processed || 0) + metrics.urlsProcessed,
            total_urls_successful: (existingMetrics?.total_urls_successful || 0) + metrics.urlsSuccessful,
            total_urls_failed: (existingMetrics?.total_urls_failed || 0) + metrics.urlsFailed,
            total_urls_generated: (existingMetrics?.total_urls_generated || 0) + metrics.urlsGenerated,
            last_updated: new Date(),
        };
        
        // Calculate average URLs per SKU
        if (updateData.total_skus_processed > 0) {
            updateData.average_urls_per_sku = 
                updateData.total_urls_generated / updateData.total_skus_processed;
        }
        
        await metricsCollection.updateOne(
            {},
            { $set: updateData },
            { upsert: true }
        );
        
        logger.info("Metrics updated", updateData);
    } catch (error) {
        logger.error("Error updating metrics", {
            error: error.message,
            stack: error.stack,
        });
        Sentry.captureException(error);
    }
};

/**
 * Processes the Kafka message for image warmup
 * @param {Object} kafka_payload - The payload from Kafka message (array of Object IDs)
 */
const process = async (kafka_payload) => {
    const startTime = Date.now();
    const objectIds = kafka_payload.ids;
    if (!Array.isArray(kafka_payload.ids) || kafka_payload.ids.length === 0) {
        logger.warn("Invalid Kafka payload: expected array of Object IDs", {
            payload: kafka_payload,
        });
        return;
    }
    
    logger.info("Processing jiomart image warmup", {
        object_ids_count: objectIds.length,
    });
    
    try {
        // Fetch documents from collection
        const documents = await fetchDocumentsFromCollection(objectIds);
        
        if (documents.length === 0) {
            logger.warn("No documents found for provided Object IDs", {
                object_ids: kafka_payload,
            });
            return;
        }
        
        // Extract and generate URLs
        const allUrlObjects = [];
        const documentUrlMap = new Map(); // Map document to its URLs for error logging
        
        documents.forEach((document) => {
            const imageUrls = extractImageUrls(document);
            const generatedUrls = [];
            
            imageUrls.forEach(({ originalUrl, variantKey, documentId, sku, brand_org }) => {
                const transformedUrls = generateImageUrls(originalUrl);
                transformedUrls.forEach((url) => {
                    console.log(url)
                    generatedUrls.push({
                        url,
                        originalUrl,
                        variantKey,
                        documentId,
                        sku,
                        brand_org,
                    });
                });
            });
            
            allUrlObjects.push(...generatedUrls);
            documentUrlMap.set(document._id.toString(), {
                document,
                urlObjects: generatedUrls,
            });
        });
        
        logger.info("Generated URLs for processing", {
            documents_count: documents.length,
            total_urls: allUrlObjects.length,
            average_urls_per_document: allUrlObjects.length / documents.length,
        });
        
        // Process URLs in batches
        const results = await processUrlsInBatches(allUrlObjects);
        
        // Group failed URLs by document for error logging
        const failedUrlsByDocument = new Map();
        results.failed.forEach((failedUrl) => {
            const docId = failedUrl.documentId;
            if (!failedUrlsByDocument.has(docId)) {
                failedUrlsByDocument.set(docId, []);
            }
            failedUrlsByDocument.get(docId).push(failedUrl);
        });
        
        // Log errors for each document
        for (const [docId, failedUrls] of failedUrlsByDocument.entries()) {
            const docData = documentUrlMap.get(docId);
            if (docData) {
                await logErrorsToCollection(docData.document, failedUrls);
            }
        }
        
        // Update metrics
        await updateMetrics({
            skusProcessed: documents.length,
            urlsProcessed: allUrlObjects.length,
            urlsSuccessful: results.successful.length,
            urlsFailed: results.failed.length,
            urlsGenerated: allUrlObjects.length,
        });
        
        const duration = Date.now() - startTime;
        logger.info("Jiomart image warmup completed successfully", {
            documents_processed: documents.length,
            urls_generated: allUrlObjects.length,
            urls_successful: results.successful.length,
            urls_failed: results.failed.length,
            duration_ms: duration,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error("Error processing jiomart image warmup", {
            error: error.message,
            stack: error.stack,
            duration_ms: duration,
            payload: kafka_payload,
        });
        Sentry.captureException(error);
        throw error;
    }
};

/**
 * Handles single message consumption from Kafka
 * @param {Object} params - Message handler parameters
 * @param {Object} params.message - Kafka message
 * @param {Function} params.heartbeat - Heartbeat function
 * @param {Number} params.partition - Partition number
 */
const onConsumeSingleMessage = async ({ message, heartbeat, partition }) => {
    const heartbeatInterval = setInterval(heartbeat, 1000);
    let kafka_payload;

    try {
        kafka_payload = JSON.parse(message.value.toString());
    } catch (error) {
        logger.error("Error parsing Kafka message", {
            error: error.message,
            rawMessage: message.value.toString(),
        });
        clearInterval(heartbeatInterval);
        return;
    }

    // Log initial payload
    logger.info("Jiomart Image Warmup message received", {
        offset: message.offset,
        partition: partition,
        object_ids_count: Array.isArray(kafka_payload) ? kafka_payload.length : 0,
    });

    try {
        await process(kafka_payload);
        logger.info(`Processing completed`);
    } catch (error) {
        logger.error({
            message: "Could not process jiomart image warmup message",
            initialPayload: kafka_payload,
            error: error.message,
            stack: error.stack,
        });
        Sentry.captureException(error);
        console.log(error);
    }
    finally {
        clearInterval(heartbeatInterval);
    }
};

module.exports = { onConsumeSingleMessage };
