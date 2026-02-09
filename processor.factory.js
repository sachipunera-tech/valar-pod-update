const {
    SAP_CATALOG,
    ASSET_UPLOAD,
    RELATIONSHIP_BULK,
    BULK_UPDATE,
    BULK_PLP_IMPORT,
    PRODUCT_MASTER_SYNC,
    BULK_EXPORT,
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
    EVENT_LOGS_CLICKHOUSE_SYNC,
    DATA_MODEL_CLICKHOUSE_SYNC,
    SOLR_CRUD,
    PRODUCT_GROCERIES_SOLR_SYNC,
    PRODUCT_ELECTRONICS_SOLR_SYNC,
    PRODUCT_FASHION_SOLR_SYNC,
    PRODUCT_COMMONGROUP1_SOLR_SYNC,
    PRODUCT_COMMONGROUP2_SOLR_SYNC,
    PRODUCT_DEFAULT_SOLR_SYNC,
    TEMP_PRODUCT_SYNC,
    JIOMART_IMAGE_WARMUP,
} = require("../../common/constants");

module.exports = {
    createConsumer(type) {
        switch (type) {
            case SAP_CATALOG:
                require("../../consumers/external_catalog");
                break;
            case ASSET_UPLOAD:
                require("../../consumers/asset");
                break;
            case RELATIONSHIP_BULK:
                require("../../consumers/relationship");
                break;
            case BULK_UPDATE:
                require("../../consumers/bulk_update");
                break;
            case BULK_PLP_IMPORT:
                require("../../consumers/bulk_plp_import");
                break;
            case PRODUCT_MASTER_SYNC:
            case PRODUCT_GROCERIES_MASTER_SYNC:
            case PRODUCT_ELECTRONICS_MASTER_SYNC:
            case PRODUCT_FASHION_MASTER_SYNC:
            case PRODUCT_COMMONGROUP1_MASTER_SYNC:
            case PRODUCT_COMMONGROUP2_MASTER_SYNC:
            case PRODUCT_DEFAULT_MASTER_SYNC:
                const { startMasterSyncConsumerByWorkerMode } = require("../../consumers/product_master_sync");
                startMasterSyncConsumerByWorkerMode(type);
                break;
            case BULK_EXPORT:
                require("../../consumers/bulk_export");
                break;
            case RELATIONSHIP_EXPORT:
                require("../../consumers/relationshipExport");
                break;
            case PRODUCT_SUBSCRIBER_RESYNC:
                require("../../consumers/productSubscriberResync");
                break;
            case PRODUCT_DELETE:
                require("../../consumers/productDelete");
                break;
            case PRODUCT_RESTORE:
                require("../../consumers/productRestore");
                break;
            case SKIP_CA:
                require("../../consumers/skip_ca");
                break;
            case RULE_ENGINE:
                require("../../consumers/ruleEngine");
                break;
            case RULE_MANUAL_EXECUTION:
                // TODO: create
                require("../../consumers/ruleEngineManual");
                break;
            case PLATFORM_STATUS:
                require("../../consumers/platformStatus");
                break;
            case AI_AUDIT_BULK:
                require("../../consumers/ai_bulk_update");
                break;
            case CLICK_HOUSE_CRUD:
            case PRODUCT_GROCERIES_CLICKHOUSE_SYNC:
            case PRODUCT_ELECTRONICS_CLICKHOUSE_SYNC:
            case PRODUCT_FASHION_CLICKHOUSE_SYNC:
            case PRODUCT_COMMONGROUP1_CLICKHOUSE_SYNC:
            case PRODUCT_COMMONGROUP2_CLICKHOUSE_SYNC:
            case PRODUCT_DEFAULT_CLICKHOUSE_SYNC:
            case EVENT_LOGS_CLICKHOUSE_SYNC:
            case DATA_MODEL_CLICKHOUSE_SYNC:
                const { startClickhouseConsumerByWorkerMode } = require("../../consumers/clickHouseCrud");
                startClickhouseConsumerByWorkerMode(type);
                break;
            case PRODUCT_GROCERIES_SOLR_SYNC:
            case PRODUCT_ELECTRONICS_SOLR_SYNC:
            case PRODUCT_FASHION_SOLR_SYNC:
            case PRODUCT_COMMONGROUP1_SOLR_SYNC:
            case PRODUCT_COMMONGROUP2_SOLR_SYNC:
            case PRODUCT_DEFAULT_SOLR_SYNC:
                const { startSolrConsumerByWorkerMode } = require("../../consumers/solrCrud");
                startSolrConsumerByWorkerMode(type);
                break;
            case CLICK_HOUSE_AUDIT_TRAIL:
                require("../../consumers/auditTrail");
                break;
            case BULK_IMPORT_PROCESS:
                require("../../consumers/bulk_import_event_process");
                break;
            case GLOBAL_ASSETS_PROCESSOR:
                require("../../consumers/globalAssetsProcessor");
                break;
            case SOLR_CRUD:
                require("../../consumers/solrCrud");
                break;
            case TEMP_PRODUCT_SYNC:
                require("../../consumers/temp_product_sync");
                break;
            case JIOMART_IMAGE_WARMUP:
                require("../../consumers/jiomart_image_warmup");
                break;
            default:
                break;
        }
    },
};
