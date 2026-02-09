"use strict";

/**
 * Script to produce messages to Kafka topic fynd-ccl-jiomart-image-warmup
 * Streams _id values from sku_image_mapping collection, batches them, and sends to Kafka
 */
require('dotenv').config();
const config = require("../../config");
const logger = require("../common/logger");
const Sentry = require("../connections/sentry");
const fitMongo = require("fit/mongo");
const { sendMessages } = require("../kafka");
const { KAFKA_TOPIC_MAP, JIOMART_IMAGE_WARMUP } = require("../common/constants");
const { connectProducers } = require("../kafka/producer");

// Configuration
const BATCH_SIZE = 100; // Number of IDs per Kafka message
const COLLECTION_NAME = "sku_image_mapping";
const TOPIC = KAFKA_TOPIC_MAP[JIOMART_IMAGE_WARMUP] || "fynd-ccl-jiomart-image-warmup";

/**
 * Streams documents from MongoDB collection and produces Kafka messages in batches
 * @param {Object} options - Configuration options
 * @param {Object} options.filter - MongoDB filter query (optional)
 * @param {number} options.batchSize - Number of IDs per Kafka message (default: 100)
 */
async function produceImageWarmupMessages(options = {}) {
    const { connections } = require("../connections/mongo");

    const { filter = {}, batchSize = BATCH_SIZE } = options;
    const connection = connections.valar.write;
    const collection = connection.db.collection(COLLECTION_NAME);

    let totalProcessed = 0;
    let totalBatches = 0;
    let totalMessages = 0;
    let batch = [];
    let errors = [];

    try {
        logger.info("Starting image warmup producer script", {
            collection: COLLECTION_NAME,
            topic: TOPIC,
            batchSize,
            filter,
        });

        // Create cursor for streaming
        const cursor = collection.find(filter, {
            projection: { _id: 1 }, // Only fetch _id field for efficiency
        }).batchSize(1000).sort({_id: 1}).limit(500); // MongoDB batch size for cursor

        logger.info("Cursor created, starting to stream documents");

        // Process documents in batches
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            
            if (doc && doc._id) {
                // Convert ObjectId to string
                const idString = doc._id.toString();
                batch.push(idString);
                totalProcessed++;

                // When batch is full, send to Kafka
                if (batch.length >= batchSize) {
                    await sendBatchToKafka(batch, totalBatches + 1);
                    totalBatches++;
                    totalMessages++;
                    batch = [];
                }
            }
        }

        // Send remaining documents in the last batch
        if (batch.length > 0) {
            await sendBatchToKafka(batch, totalBatches + 1);
            totalBatches++;
            totalMessages++;
        }

        logger.info("Image warmup producer script completed successfully", {
            totalProcessed,
            totalBatches,
            totalMessages,
            errors: errors.length,
        });

        if (errors.length > 0) {
            logger.warn("Some errors occurred during processing", {
                errorCount: errors.length,
                errors: errors.slice(0, 10), // Log first 10 errors
            });
        }

        return {
            success: true,
            totalProcessed,
            totalBatches,
            totalMessages,
            errors: errors.length,
        };
    } catch (error) {
        logger.error("Error in image warmup producer script", {
            error: error.message,
            stack: error.stack,
            totalProcessed,
            totalBatches,
        });
        Sentry.captureException(error);
        throw error;
    }
}

/**
 * Sends a batch of IDs to Kafka topic
 * @param {Array<string>} ids - Array of document IDs
 * @param {number} batchNumber - Batch number for logging
 */
async function sendBatchToKafka(ids, batchNumber) {
    try {
        const message = { ids };
        
        logger.info("Sending batch to Kafka", {
            batchNumber,
            idsCount: ids.length,
            topic: TOPIC,
        });

        await sendMessages(TOPIC, [message]);

        logger.info("Batch sent successfully", {
            batchNumber,
            idsCount: ids.length,
        });
    } catch (error) {
        logger.error("Error sending batch to Kafka", {
            batchNumber,
            idsCount: ids.length,
            error: error.message,
            stack: error.stack,
        });
        Sentry.captureException(error);
        throw error;
    }
}

/**
 * Main execution function
 */
async function main() {

    try {
        // Initialize MongoDB connection
        await fitMongo.init();
        
        // Initialize Kafka producer
        // Ensure server_type is set for Kafka producer initialization
        // Scripts should set SERVER_TYPE environment variable or config
        if (!config.server_type) {
            logger.warn("server_type not set in config, defaulting to 'internal' for script execution");
            // Note: This may not work if config is frozen, but worth trying
            try {
                config.server_type = "internal";
            } catch (e) {
                logger.warn("Could not set server_type, ensure SERVER_TYPE env var is set");
            }
        }
        
        await connectProducers();

        // Parse command line arguments for filter (optional)
        const args = process.argv.slice(2);
        let filter = {};

        // Example: node script.js --filter '{"brand_org":"some-org-id"}'
        if (args.length > 0) {
            const filterArg = args.find(arg => arg.startsWith('--filter='));
            if (filterArg) {
                try {
                    const filterStr = filterArg.split('=')[1];
                    filter = JSON.parse(filterStr);
                    logger.info("Using custom filter", { filter });
                } catch (error) {
                    logger.warn("Invalid filter JSON, using default filter", {
                        error: error.message,
                    });
                }
            }

            // Parse batch size if provided
            const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='));
            if (batchSizeArg) {
                const batchSize = parseInt(batchSizeArg.split('=')[1], 10);
                if (batchSize > 0) {
                    const result = await produceImageWarmupMessages({
                        filter,
                        batchSize,
                    });
                    console.log("Script completed:", result);
                    process.exit(0);
                    return;
                }
            }
        }

        // Run with default options
        const result = await produceImageWarmupMessages({ filter });
        console.log("Script completed:", result);
        process.exit(0);
    } catch (error) {
        logger.error("Fatal error in main function", {
            error: error.message,
            stack: error.stack,
        });
        Sentry.captureException(error);
        process.exit(1);
    }
}

main();


module.exports = {
    produceImageWarmupMessages,
    sendBatchToKafka,
};
