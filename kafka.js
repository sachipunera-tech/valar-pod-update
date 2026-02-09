const { init, initProducer, initConsumer } = require("fit/kafka");
const {
    KAFKA_GROUPID_MAP,
    RELATIONSHIP_EXPORT,
    BULK_PLP_IMPORT,
    BULK_EXPORT,
    BULK_UPDATE,
    PRODUCT_MASTER_SYNC,
    RELATIONSHIP_BULK,
    ASSET_UPLOAD,
    SAP_CATALOG,
    PRODUCT_SUBSCRIBER_RESYNC,
    PRODUCT_DELETE,
    PRODUCT_RESTORE,
    SKIP_CA,
    RULE_ENGINE,
    RULE_MANUAL_EXECUTION,
    PLATFORM_STATUS,
    AI_AUDIT_BULK,
    KAFKA_TOPIC_MAP,
    CLICK_HOUSE_CRUD,
    CLICK_HOUSE_AUDIT_TRAIL,
    BULK_IMPORT_PROCESS,
    GLOBAL_ASSETS_PROCESSOR,
    PRODUCT_GROCERIES_MASTER_SYNC,
    PRODUCT_ELECTRONICS_MASTER_SYNC,
    PRODUCT_FASHION_MASTER_SYNC,
    PRODUCT_COMMONGROUP1_MASTER_SYNC,
    PRODUCT_COMMONGROUP2_MASTER_SYNC,
    PRODUCT_DEFAULT_MASTER_SYNC,
    PRODUCT_GROCERIES_CLICKHOUSE_SYNC,
    PRODUCT_ELECTRONICS_CLICKHOUSE_SYNC,
    PRODUCT_FASHION_CLICKHOUSE_SYNC,
    PRODUCT_COMMONGROUP1_CLICKHOUSE_SYNC,
    PRODUCT_COMMONGROUP2_CLICKHOUSE_SYNC,
    PRODUCT_DEFAULT_CLICKHOUSE_SYNC,
    DATA_MODEL_CLICKHOUSE_SYNC,
    EVENT_LOGS_CLICKHOUSE_SYNC,
    SOLR_CRUD,
    PRODUCT_GROCERIES_SOLR_SYNC,
    PRODUCT_ELECTRONICS_SOLR_SYNC,
    PRODUCT_FASHION_SOLR_SYNC,
    PRODUCT_COMMONGROUP1_SOLR_SYNC,
    PRODUCT_COMMONGROUP2_SOLR_SYNC,
    PRODUCT_DEFAULT_SOLR_SYNC,
    TEMP_PRODUCT_SYNC,
    JIOMART_IMAGE_WARMUP,
} = require("../common/constants");
const config = require("../../config");
const acceptedProducerModes = ["panel", "platform", "internal", "public"];
const acceptedConsumerModes = [
    SAP_CATALOG,
    ASSET_UPLOAD,
    RELATIONSHIP_BULK,
    BULK_UPDATE,
    PRODUCT_MASTER_SYNC,
    BULK_EXPORT,
    BULK_PLP_IMPORT,
    RELATIONSHIP_EXPORT,
    PRODUCT_SUBSCRIBER_RESYNC,
    PRODUCT_DELETE,
    PRODUCT_RESTORE,
    SKIP_CA,
    RULE_ENGINE,
    RULE_MANUAL_EXECUTION,
    PLATFORM_STATUS,
    AI_AUDIT_BULK,
    CLICK_HOUSE_CRUD,
    CLICK_HOUSE_AUDIT_TRAIL,
    BULK_IMPORT_PROCESS,
    GLOBAL_ASSETS_PROCESSOR,
    PRODUCT_GROCERIES_MASTER_SYNC,
    PRODUCT_ELECTRONICS_MASTER_SYNC,
    PRODUCT_FASHION_MASTER_SYNC,
    PRODUCT_COMMONGROUP1_MASTER_SYNC,
    PRODUCT_COMMONGROUP2_MASTER_SYNC,
    PRODUCT_DEFAULT_MASTER_SYNC,
    PRODUCT_GROCERIES_CLICKHOUSE_SYNC,
    PRODUCT_ELECTRONICS_CLICKHOUSE_SYNC,
    PRODUCT_FASHION_CLICKHOUSE_SYNC,
    PRODUCT_COMMONGROUP1_CLICKHOUSE_SYNC,
    PRODUCT_COMMONGROUP2_CLICKHOUSE_SYNC,
    PRODUCT_DEFAULT_CLICKHOUSE_SYNC,
    DATA_MODEL_CLICKHOUSE_SYNC,
    EVENT_LOGS_CLICKHOUSE_SYNC,
    SOLR_CRUD,
    PRODUCT_GROCERIES_SOLR_SYNC,
    PRODUCT_ELECTRONICS_SOLR_SYNC,
    PRODUCT_FASHION_SOLR_SYNC,
    PRODUCT_COMMONGROUP1_SOLR_SYNC,
    PRODUCT_COMMONGROUP2_SOLR_SYNC,
    PRODUCT_DEFAULT_SOLR_SYNC,
    TEMP_PRODUCT_SYNC,
    JIOMART_IMAGE_WARMUP,
];

let serverMode = config.server_type;
let workerMode = config.worker_mode;
let kafkaConfig = config.kafka;

let producerInstance;

/**
 * @author Sourabh Nilakhe
 * @description run at the start of the program to connect to kafka producer
 * @returns global single producer instance from a single kafka client
 */
const getKafkaProducer = async () => {
    if (!acceptedProducerModes.includes(serverMode)) return;
    if (producerInstance) return producerInstance;
    const kafka = init();
    producerInstance = await initProducer(kafka);
    return producerInstance;
};

/**
 *
 * @author Sourabh Nilakhe
 * @param {*} groupId
 * @returns consumer instance of worker mode
 */
const getKafkaConsumer = async (worker_type) => {
    if (!acceptedConsumerModes.includes(workerMode)) return;
    let { heartbeat_interval, session_timeout, max_bytes_per_partition, min_bytes, max_bytes, max_wait_time_in_ms } = kafkaConfig;
    const kafka = init();
    const groupId = KAFKA_GROUPID_MAP[worker_type] || "catalog-default-group";
    const topic = KAFKA_TOPIC_MAP[worker_type];
    let topics = topic;
    if (!Array.isArray(topic)) {
        topics = [topic];
    }
    const sessionTimeout = (session_timeout || 90) * 1000;
    const heartbeatInterval = (heartbeat_interval || 30) * 1000;
    const consumer = await initConsumer(
        { groupId, sessionTimeout, heartbeatInterval, maxBytesPerPartition: max_bytes_per_partition, minBytes: min_bytes, maxBytes: max_bytes, maxWaitTimeInMs: max_wait_time_in_ms },
        { topics },
        kafka
    );
    return consumer;
};

module.exports = { getKafkaProducer, getKafkaConsumer };
