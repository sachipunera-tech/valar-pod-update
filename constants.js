const ERROR_TYPE_PREFIX = "EXCEPTION_IN_CC";
const VERTICALS = {
    BEAUTY: "beauty",
    BOOKS: "books",
    CRAFTSOFINDIA: "craftsofindia",
    ELECTRONICS: "electronics",
    FASHION: "fashion",
    FURNITURE: "furniture",
    GROCERIES: "groceries",
    HOMEANDKITCHEN: "homeandkitchen",
    HOMEIMPROVEMENT: "homeimprovement",
    JEWELLERY: "jewellery",
    LOCALSHOPS: "localshops",
    MEDICINE: "medicine",
    PREMIUMFRUITS: "premiumfruits",
    SPORTSTOYSLUGGAGE: "sportstoysluggage",
    WELLNESS: "wellness",
};

const PRODUCT_MASTER_SYNC_TOPICS = {
    GROCERIES: "fynd-ccl-json-product-groceries-master-sync",
    ELECTRONICS: "fynd-ccl-json-product-electronics-master-sync",
    FASHION: "fynd-ccl-json-product-fashion-master-sync",
    COMMONGROUP1: "fynd-ccl-json-product-commongroup1-master-sync",
    COMMONGROUP2: "fynd-ccl-json-product-commongroup2-master-sync",
    DEFAULT: "fynd-ccl-json-product-default-master-sync",
};

const getProductMasterSyncTopic = (vertical) => {
    const normalizedVertical = vertical?.trim()?.toLowerCase();
    switch (normalizedVertical) {
        case VERTICALS.GROCERIES:
            return PRODUCT_MASTER_SYNC_TOPICS.GROCERIES;
        case VERTICALS.ELECTRONICS:
            return PRODUCT_MASTER_SYNC_TOPICS.ELECTRONICS;
        case VERTICALS.FASHION:
            return PRODUCT_MASTER_SYNC_TOPICS.FASHION;
        case VERTICALS.JEWELLERY:
        case VERTICALS.FURNITURE:
        case VERTICALS.CRAFTSOFINDIA:
        case VERTICALS.SPORTSTOYSLUGGAGE:
            return PRODUCT_MASTER_SYNC_TOPICS.COMMONGROUP1;
        case VERTICALS.BEAUTY:
        case VERTICALS.WELLNESS:
        case VERTICALS.MEDICINE:
        case VERTICALS.BOOKS:
            return PRODUCT_MASTER_SYNC_TOPICS.COMMONGROUP2;
        default:
            return PRODUCT_MASTER_SYNC_TOPICS.DEFAULT;
    }
};

const PRODUCT_SYNC_TOPICS = {
    GROCERIES: "fynd-ccl-product-groceries-sync",
    ELECTRONICS: "fynd-ccl-product-electronics-sync",
    FASHION: "fynd-ccl-product-fashion-sync",
    COMMONGROUP1: "fynd-ccl-product-commongroup1-sync",
    COMMONGROUP2: "fynd-ccl-product-commongroup2-sync",
    DEFAULT: "fynd-ccl-product-default-sync",
};

const PRODUCT_WEBHOOK_TOPICS = {
    GROCERIES: "product-groceries-webhook",
    ELECTRONICS: "product-electronics-webhook",
    FASHION: "product-fashion-webhook",
    COMMONGROUP1: "product-commongroup1-webhook",
    COMMONGROUP2: "product-commongroup2-webhook",
    DEFAULT: "product-default-webhook",
};

const getProductSyncTopic = (vertical) => {
    const normalizedVertical = vertical?.trim()?.toLowerCase();
    switch (normalizedVertical) {
        case VERTICALS.GROCERIES:
            return PRODUCT_SYNC_TOPICS.GROCERIES;
        case VERTICALS.ELECTRONICS:
            return PRODUCT_SYNC_TOPICS.ELECTRONICS;
        case VERTICALS.FASHION:
            return PRODUCT_SYNC_TOPICS.FASHION;
        case VERTICALS.JEWELLERY:
        case VERTICALS.FURNITURE:
        case VERTICALS.CRAFTSOFINDIA:
        case VERTICALS.SPORTSTOYSLUGGAGE:
            return PRODUCT_SYNC_TOPICS.COMMONGROUP1;
        case VERTICALS.BEAUTY:
        case VERTICALS.WELLNESS:
        case VERTICALS.MEDICINE:
        case VERTICALS.BOOKS:
            return PRODUCT_SYNC_TOPICS.COMMONGROUP2;
        default:
            return PRODUCT_SYNC_TOPICS.DEFAULT;
    }
};

const getProductWebhookTopicId = (vertical) => {
    const normalizedVertical = vertical?.trim()?.toLowerCase();
    switch (normalizedVertical) {
        case VERTICALS.GROCERIES:
            return PRODUCT_WEBHOOK_TOPICS.GROCERIES;
        case VERTICALS.ELECTRONICS:
            return PRODUCT_WEBHOOK_TOPICS.ELECTRONICS;
        case VERTICALS.FASHION:
            return PRODUCT_WEBHOOK_TOPICS.FASHION;
        case VERTICALS.JEWELLERY:
        case VERTICALS.FURNITURE:
        case VERTICALS.CRAFTSOFINDIA:
        case VERTICALS.SPORTSTOYSLUGGAGE:
            return PRODUCT_WEBHOOK_TOPICS.COMMONGROUP1;
        case VERTICALS.BEAUTY:
        case VERTICALS.WELLNESS:
        case VERTICALS.MEDICINE:
        case VERTICALS.BOOKS:
            return PRODUCT_WEBHOOK_TOPICS.COMMONGROUP2;
        default:
            return PRODUCT_WEBHOOK_TOPICS.DEFAULT;
    }
};

module.exports = {
    SERVER: "valar_server",

    VILYA_START: "v1/asset/uploads/start",
    VILYA_STOP: "v1/asset/uploads/complete",

    SAP_CATALOG: "external-catalog",
    ASSET_UPLOAD: "asset-worker",
    RELATIONSHIP_BULK: "relationship-bulk-worker",
    RELATIONSHIP_EXPORT: "relationship-export-worker",
    BULK_UPDATE: "bulk-update",
    BULK_EXPORT: "bulk-export",
    BULK_PLP_IMPORT: "bulk-plp-import",
    PRODUCT_WEBHOOK: "product-webhook",
    RELATIONSHIP_WEBHOOK: "relationship-webhook",
    PRODUCT_MASTER_SYNC: "product-master-sync",
    PRODUCT_SUBSCRIBER_RESYNC: "retrigger-subscriber-sync",
    PRODUCT_DELETE: "product-delete",
    PRODUCT_RESTORE: "product-restore",
    SKIP_CA: "skip-ca",
    RULE_ENGINE: "rule-execution-engine",
    RULE_MANUAL_EXECUTION: "rule-manual-execution",
    PLATFORM_STATUS: "platform_status",
    REFLOW: "reflow",
    AI_AUDIT_BULK: "ai-audit-bulk",
    CLICK_HOUSE_CRUD: "click-house-crud",
    CLICK_HOUSE_AUDIT_TRAIL: "click-house-audit-trail",
    BULK_IMPORT_PROCESS: "bulk-import-process",
    GLOBAL_ASSETS_PROCESSOR: "global_assets_processor",
    PRODUCT_GROCERIES_MASTER_SYNC: "product-groceries-master-sync",
    PRODUCT_ELECTRONICS_MASTER_SYNC: "product-electronics-master-sync",
    PRODUCT_FASHION_MASTER_SYNC: "product-fashion-master-sync",
    PRODUCT_COMMONGROUP1_MASTER_SYNC: "product-commongroup1-master-sync",
    PRODUCT_COMMONGROUP2_MASTER_SYNC: "product-commongroup2-master-sync",
    PRODUCT_DEFAULT_MASTER_SYNC: "product-default-master-sync",
    PRODUCT_GROCERIES_CLICKHOUSE_SYNC: "clickhouse-product-groceries-sync",
    PRODUCT_ELECTRONICS_CLICKHOUSE_SYNC: "clickhouse-product-electronics-sync",
    PRODUCT_FASHION_CLICKHOUSE_SYNC: "clickhouse-product-fashion-sync",
    PRODUCT_COMMONGROUP1_CLICKHOUSE_SYNC: "clickhouse-product-commongroup1-sync",
    PRODUCT_COMMONGROUP2_CLICKHOUSE_SYNC: "clickhouse-product-commongroup2-sync",
    PRODUCT_DEFAULT_CLICKHOUSE_SYNC: "clickhouse-product-default-sync",
    EVENT_LOGS_CLICKHOUSE_SYNC: "clickhouse-event-logs-sync",
    DATA_MODEL_CLICKHOUSE_SYNC: "clickhouse-data-model-sync",
    PRODUCT_WEBHOOK_TOPICS,
    SOLR_CRUD: "solr-crud",
    TEMP_PRODUCT_SYNC: "temp-product-sync",
    JIOMART_IMAGE_WARMUP: "jiomart-image-warmup",

    PRODUCT_GROCERIES_SOLR_SYNC: "solr-product-groceries-sync",
    PRODUCT_ELECTRONICS_SOLR_SYNC: "solr-product-electronics-sync",
    PRODUCT_FASHION_SOLR_SYNC: "solr-product-fashion-sync",
    PRODUCT_COMMONGROUP1_SOLR_SYNC: "solr-product-commongroup1-sync",
    PRODUCT_COMMONGROUP2_SOLR_SYNC: "solr-product-commongroup2-sync",
    PRODUCT_DEFAULT_SOLR_SYNC: "solr-product-default-sync",
    KAFKA_TOPIC_MAP: {
        "external-catalog": "fynd-external-catalog-json",
        "batch-item": "fynd-json-process-batch-item",
        "relationship-bulk-worker": "fynd-relationship-mapping-bulk",
        "asset-worker": "fynd-enrichment-tasks-asset",
        "bulk-update": "fynd-internal-bulk-update",
        "bulk-export": "fynd-internal-bulk-export",
        "bulk-plp-import": "fynd-internal-bulk-plp-import",
        "product-webhook": "fynd-ccl-webhook-product-event",
        "relationship-webhook": "fynd-ccl-webhook-relationship-mapping-event",
        "product-master-sync": "fynd-ccl-json-product-master-sync",
        "relationship-export-worker": "fynd-ccl-relationship-export-worker",
        "retrigger-subscriber-sync": "fynd-ccl-products-subscriber-resync",
        "product-delete": "fynd-ccl-products-delete",
        "product-restore": "fynd-ccl-products-restore",
        "skip-ca": "fynd-ccl-skip-ca",
        "rule-execution-engine": "fynd-ccl-rule-execution-engine",
        "rule-manual-execution": "fynd-ccl-rule-manual-execution",
        platform_status: [
            "fynd-json-palantir-platform-status-update",
            "fynd-json-narya-3p-logs-status-update",
        ],
        reflow: "fynd-ccl-webhook-reflow-product",
        "ai-audit-bulk": "fynd-ccl-ai-audit-bulk",
        "click-house-crud": "fynd-ccl-click-house-crud",
        "click-house-audit-trail": "fynd-ccl-click-house-audit-trail",
        "bulk-import-process": "fynd-ccl-bulk-import-process",
        "global_assets_processor": "fynd-ccl-global-assets-processor",
        "product-groceries-master-sync": "fynd-ccl-json-product-groceries-master-sync",
        "product-electronics-master-sync": "fynd-ccl-json-product-electronics-master-sync",
        "product-fashion-master-sync":  "fynd-ccl-json-product-fashion-master-sync",
        "product-commongroup1-master-sync": "fynd-ccl-json-product-commongroup1-master-sync",
        "product-commongroup2-master-sync": "fynd-ccl-json-product-commongroup2-master-sync",
        "product-default-master-sync": "fynd-ccl-json-product-default-master-sync",
        [PRODUCT_WEBHOOK_TOPICS.GROCERIES]: "fynd-ccl-webhook-product-groceries-event",
        [PRODUCT_WEBHOOK_TOPICS.ELECTRONICS]: "fynd-ccl-webhook-product-electronics-event",
        [PRODUCT_WEBHOOK_TOPICS.FASHION]: "fynd-ccl-webhook-product-fashion-event",
        [PRODUCT_WEBHOOK_TOPICS.COMMONGROUP1]: "fynd-ccl-webhook-product-commongroup1-event",
        [PRODUCT_WEBHOOK_TOPICS.COMMONGROUP2]: "fynd-ccl-webhook-product-commongroup2-event",
        [PRODUCT_WEBHOOK_TOPICS.DEFAULT]: "fynd-ccl-webhook-product-default-event",
        "product-groceries-sync-update": "fynd-ccl-product-groceries-sync",
        "product-electronics-sync-update": "fynd-ccl-product-electronics-sync",
        "product-fashion-sync-update": "fynd-ccl-product-fashion-sync",
        "product-commongroup1-sync-update": "fynd-ccl-product-commongroup1-sync",
        "product-commongroup2-sync-update": "fynd-ccl-product-commongroup2-sync",
        "product-default-sync-update": "fynd-ccl-product-default-sync",
        "data-model-sync-update": "fynd-ccl-data-model-sync",
        "clickhouse-product-groceries-sync": "fynd-ccl-product-groceries-sync",
        "clickhouse-product-electronics-sync": "fynd-ccl-product-electronics-sync",
        "clickhouse-product-fashion-sync": "fynd-ccl-product-fashion-sync",
        "clickhouse-product-commongroup1-sync": "fynd-ccl-product-commongroup1-sync",
        "clickhouse-product-commongroup2-sync": "fynd-ccl-product-commongroup2-sync",
        "clickhouse-product-default-sync": "fynd-ccl-product-default-sync",
        "clickhouse-event-logs-sync": "fynd-ccl-event-logs-sync",
        "clickhouse-data-model-sync": "fynd-ccl-data-model-sync",
        //TODO: Needs to be removed after topic segregation is done
        "solr-crud": "fynd-ccl-click-house-crud", // Listens to same topic as ClickHouse
        "solr-product-groceries-sync": "fynd-ccl-product-groceries-sync",
        "solr-product-electronics-sync": "fynd-ccl-product-electronics-sync",
        "solr-product-fashion-sync": "fynd-ccl-product-fashion-sync",
        "solr-product-commongroup1-sync": "fynd-ccl-product-commongroup1-sync",
        "solr-product-commongroup2-sync": "fynd-ccl-product-commongroup2-sync",
        "solr-product-default-sync": "fynd-ccl-product-default-sync",
        "temp-product-sync": "fynd-json-valar-temp-product-sync",
        "jiomart-image-warmup": "fynd-ccl-jiomart-image-warmup",
    },

    KAFKA_GROUPID_MAP: {
        "external-catalog": "fynd-external-catalog-group",
        "batch-item": "fynd-json-process-batch-group",
        "asset-worker": "fynd-enrichment-tasks-asset-group",
        "relationship-bulk-worker": "fynd-relationship-mapping-bulk-group",
        "bulk-update": "fynd-internal-bulk-update-group",
        "bulk-export": "fynd-internal-bulk-export-group",
        "bulk-plp-import": "fynd-internal-bulk-plp-import-group",
        "product-master-sync": "fynd-ccl-product-master-sync-group",
        "relationship-export-worker":
            "fynd-ccl-relationship-export-worker-group",
        "retrigger-subscriber-sync":
            "fynd-ccl-products-subscriber-resync-group",
        "product-delete": "fynd-ccl-products-delete-group",
        "product-restore": "fynd-ccl-products-restore-group",
        "skip-ca": "fynd-ccl-skip-ca-group",
        "rule-execution-engine": "fynd-ccl-rule-execution-engine-group",
        "rule-manual-execution": "fynd-ccl-rule-manual-execution-group",
        platform_status: "fynd-json-palantir-platform-status-update-group",
        reflow: "fynd-json-palantir-reflow",
        "ai-audit-bulk": "fynd-ccl-ai-audit-bulk-group",
        "click-house-crud": "fynd-ccl-click-house-crud-group",
        "click-house-audit-trail": "fynd-ccl-click-house-audit-trail-group",
        "bulk-import-process": "fynd-internal-bulk-import-process-group-1",
        "global_assets_processor": "fynd-ccl-global-assets-processor-group",
        "product-groceries-master-sync": "fynd-ccl-product-groceries-master-sync-group",
        "product-electronics-master-sync": "fynd-ccl-product-electronics-master-sync-group",
        "product-fashion-master-sync":  "fynd-ccl-product-fashion-master-sync-group",
        "product-commongroup1-master-sync": "fynd-ccl-product-commongroup1-master-sync-group",
        "product-commongroup2-master-sync": "fynd-ccl-product-commongroup2-master-sync-group",
        "product-default-master-sync": "fynd-ccl-product-default-master-sync-group",
        "clickhouse-product-groceries-sync": "clickhouse-product-groceries-sync-group",
        "clickhouse-product-electronics-sync": "clickhouse-product-electronics-sync-group",
        "clickhouse-product-fashion-sync": "clickhouse-product-fashion-sync-group",
        "clickhouse-product-commongroup1-sync": "clickhouse-product-commongroup1-sync-group",
        "clickhouse-product-commongroup2-sync": "clickhouse-product-commongroup2-sync-group",
        "clickhouse-product-default-sync": "clickhouse-product-default-sync-group",
        "clickhouse-event-logs-sync": "clickhouse-event-logs-sync-group",
        "clickhouse-data-model-sync": "clickhouse-data-model-sync-group",
        "solr-crud": "fynd-ccl-solr-crud-group", // Different group for Solr consumer
        "solr-product-groceries-sync": "solr-product-groceries-sync-group",
        "solr-product-electronics-sync": "solr-product-electronics-sync-group",
        "solr-product-fashion-sync": "solr-product-fashion-sync-group",
        "solr-product-commongroup1-sync": "solr-product-commongroup1-sync-group",
        "solr-product-commongroup2-sync": "solr-product-commongroup2-sync-group",
        "solr-product-default-sync": "solr-product-default-sync-group",
        "temp-product-sync": "fynd-json-valar-temp-product-sync-group",
        "jiomart-image-warmup": "fynd-ccl-jiomart-image-warmup-group",
    },
    WEBHOOK_ACTION: {
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete",
    },
    VARIANT: "variant",
    PARENT_CHILD: "parent-child",

    RULE_RUN_TTL: 172800, // 2day
    JOB_STATUS: {
        INITIATED: "INITIATED",
        COMPUTING_IDS_INITIATED: "COMPUTING_IDS_INITIATED",
        COMPUTING_IDS_COMPLETED: "COMPUTING_IDS_COMPLETED",
        CREATING_JOBS_INITIATED: "CREATING_JOBS_INITIATED",
        CREATING_JOBS_COMPLETED: "CREATING_JOBS_COMPLETED",
        CC_PROCESSING_DATA_INITIATED: "CC_PROCESSING_DATA_INITIATED",
        CC_PROCESSING_DATA_COMPLETED: "CC_PROCESSING_DATA_COMPLETED",
        CC_PROCESSING_DATA_FAILED: "CC_PROCESSING_DATA_FAILED",
        PUSH_TO_PLATFORM_INITIATED: "PUSH_TO_PLATFORM_INITIATED",
        PUSH_TO_PLATFORM_COMPLETED: "PUSH_TO_PLATFORM_COMPLETED",
    },
    STAGE: {
        CC_PROCESSING: "cc_processing",
        PUSH_TO_PLATFORM: "push_to_platform",
    },
    ERROR_TYPE_PREFIX,
    ERROR_TYPES: {
        WORKER_CRASHED: `${ERROR_TYPE_PREFIX}_WORKER_CRASHED`,
        GENERIC_ERROR: `${ERROR_TYPE_PREFIX}_GENERIC_ERROR`,
        CATEGORY_MAPPING_NOT_FOUND: `${ERROR_TYPE_PREFIX}_CATEGORY_MAPPING_NOT_FOUND`,
        UNABLE_TO_FETCH_RELATIONSHIPS: `${ERROR_TYPE_PREFIX}_UNABLE_TO_FETCH_RELATIONSHIPS`,
        UNABLE_TO_GROUP_ATTRIBUTES: `${ERROR_TYPE_PREFIX}_UNABLE_TO_GROUP_ATTRIBUTES`,
    },
    FILTER_QUERY_TYPE: {
        SINGLE: "SINGLE",
        SINGLE_NOT_EQUAL: "SINGLE_NOT_EQUAL",
        MULTIPLE: "MULTIPLE",
        RANGE: "RANGE",
    },
    CLICKHOUSE_SCHEMA_AUTO_CREATION: {
        enrichment_products: `
            CREATE TABLE IF NOT EXISTS enrichment_products
            (
                _id String,
                sku String,
                grouped_sku String,
                product_label Array(String) DEFAULT [],
                category_mapping String,
                attribute_data Array(Tuple(code String, value String)),
                brand_org String,
                stage String DEFAULT 'RAW',
                status String DEFAULT 'PENDING',
                meta String DEFAULT '{}',
                variant String DEFAULT '{}',
                group_id String,
                is_archived Bool DEFAULT false,
                archived_on DateTime,
                archived_by String,
                created_by String,
                modified_by String DEFAULT ' ',
                created_at DateTime DEFAULT now(),
                updated_at DateTime DEFAULT now(),
                is_ai_enriched Bool DEFAULT false,
                is_deleted UInt8 DEFAULT 0,
                brand Nullable(String),
                vertical Nullable(String),
                sku_health Float32 DEFAULT 0,
                sku_fill_rate Float32 DEFAULT 0,
            )
            ENGINE = ReplacingMergeTree(updated_at)
            PRIMARY KEY (sku, brand_org)
            ORDER BY (sku, brand_org);
        `,
        master_products: `
            CREATE TABLE IF NOT EXISTS master_products
            (
                _id String,
                sku String,
                grouped_sku String,
                product_label Array(String) DEFAULT [],
                category_mapping String,
                attribute_data Array(Tuple(code String, value String)),
                brand_org String,
                meta String DEFAULT '{}',
                variant String DEFAULT '{}',
                group_id String,
                created_by String,
                modified_by String DEFAULT ' ',
                created_at DateTime DEFAULT now(),
                updated_at DateTime DEFAULT now(),
                brand Nullable(String),
                vertical Nullable(String),
                is_ai_enriched Bool DEFAULT false,
            )
            ENGINE = ReplacingMergeTree(updated_at)
            PRIMARY KEY (sku, brand_org)
            ORDER BY (sku, brand_org);
        `,
        task: `
            CREATE TABLE IF NOT EXISTS tasks
            (
                _id String,
                id String,
                readable_id String,
                name String,
                description Nullable(String),
                helper_docs Array(String) DEFAULT [],
                vendor_id String,
                brand_id String,
                type String,
                allocation_type Enum('Internal', 'External'), 
                split Bool DEFAULT false,
                assigned_group String,
                assigned_members Array(String),
                status Enum('Pending', 'In Progress', 'In Query', 'In Review', 'Done', 'Rejected', 'Do Not Proceed', 'Archived', 'Recalled') DEFAULT 'Pending',
                priorities Enum('High', 'Mid', 'Low') DEFAULT 'Low',
                due_date Nullable(DateTime),
                attributes Array(String),
                attachments Array(String),
                created_at DateTime DEFAULT now(),
                updated_at DateTime DEFAULT now(),
                created_by String,
                modified_by String
            )
            ENGINE = ReplacingMergeTree(updated_at)
            PRIMARY KEY (id, brand_id)
            ORDER BY (id, brand_id);
        `,
        attributeTableCreation: `CREATE TABLE IF NOT EXISTS attributes
            (
                _id               String,
                name              String,
                active            Bool DEFAULT true,
                code              String,
                auto_sync_to_prod Bool DEFAULT true,
                description       Nullable(String),
                vms_visible       Bool DEFAULT true,
                vms_editable      Bool DEFAULT true,
                store_filter      Bool DEFAULT false,
                store_display_plp Bool DEFAULT false,
                store_display_pdp Bool DEFAULT false,
                store_search      Bool DEFAULT false,
                store_compare     Bool DEFAULT false,
                tags              Array(String),
                type              Enum8(
                                    'Short Text'   = 1,
                                    'Paragraph'    = 2,
                                    'Date'         = 3,
                                    'Date & Time'  = 4,
                                    'HTML'         = 5,
                                    'Number'       = 6,
                                    'Decimal'      = 7,
                                    'List'         = 8,
                                    'Boolean'      = 9,
                                    'URL'          = 10,
                                    'Media'        = 11,
                                    'File'         = 12
                                ),
                mandatory         Bool DEFAULT true,
                jsonata           Nullable(String),
                _custom_json      String DEFAULT '{}',
                specific_fields   String DEFAULT '{}',
                created_at        DateTime DEFAULT now(),
                updated_at        DateTime DEFAULT now(),
                created_by        String,
                modified_by       String,
                x_org_id          String,
                meta              String
            )
            ENGINE = ReplacingMergeTree(updated_at)
            PRIMARY KEY (code, x_org_id)
            ORDER BY (code, x_org_id);
        `,
        categoryTableCreation: `CREATE TABLE IF NOT EXISTS categories
            (
                _id            UInt64,
                name           String,
                code           String,
                archive        Bool DEFAULT false,
                tags           Array(String) DEFAULT [],
                x_org_id       String,
                created_by     String,
                modified_by    String,
                media          String DEFAULT '{}',
                is_active      Bool DEFAULT true,
                _custom_json   String DEFAULT '{}',
                created_at     DateTime DEFAULT now(),
                updated_at     DateTime DEFAULT now(),
                meta           String
            )
            ENGINE = ReplacingMergeTree(updated_at)
            PRIMARY KEY (_id, x_org_id)
            ORDER BY (_id, x_org_id);
        `,
        auditTrailTableCreation: `CREATE TABLE IF NOT EXISTS audit_trail
            (
                id String,
                x_org_id String,
                payload String,
                event_id String,
                description Nullable(String),
                action String,
                timestamp UInt64,
                modified_by String,
                created_by String,
                event_type String,
                event_code String,
            )
            ENGINE = ReplacingMergeTree(timestamp)
            PRIMARY KEY (event_id)
            ORDER BY (event_id);
        `,
        templateTableCreation: `CREATE TABLE IF NOT EXISTS templates
            (
                _id String,
                name String,
                description Nullable(String),
                active Bool DEFAULT true,
                expirable Bool DEFAULT false,
                physical Bool DEFAULT true,
                public Bool DEFAULT false,
                groups String,
                attributes String,
                x_org_id String,
                tags Array(String) DEFAULT [],
                _custom_json String,
                mapper Nullable(String),
                created_by String,
                modified_by String,
                created_at DateTime DEFAULT now(),
                updated_at DateTime DEFAULT now()
            )
            ENGINE = ReplacingMergeTree(updated_at)
            PRIMARY KEY (_id, x_org_id)
            ORDER BY (_id, x_org_id);
        `,
        categoryTreeTableCreation: `CREATE TABLE IF NOT EXISTS category_mapping
        (
                _id UInt64,
                category_level UInt8,
                code String,
                mapping String,
                archive Bool DEFAULT false,
                mapping_code Array(String),
                _custom_json String,
                is_active Bool DEFAULT true,
                is_auto_generated Bool DEFAULT false,
                x_org_id String,
                created_by String,
                modified_by String,
                tags Array(String),
                created_at DateTime DEFAULT now(),
                updated_at DateTime DEFAULT now(),
                hierarchy String,
                last_mapping_node String,
                meta String
            ) 
            ENGINE = ReplacingMergeTree(updated_at)
            PRIMARY KEY (_id, x_org_id)
            ORDER BY (_id, x_org_id);
        `,
        inboundLogsTableCreation: `CREATE TABLE IF NOT EXISTS inbound_logs
        (
                _id String,
                name String,
                inbound_id String,
                stage String,
                x_org_id String,
                timestamp DateTime DEFAULT now(),
            ) 
            ENGINE = ReplacingMergeTree(timestamp)
            PRIMARY KEY (_id, x_org_id)
            ORDER BY (_id, x_org_id);
        `,
        outboundLogsTableCreation: `CREATE TABLE IF NOT EXISTS outbound_logs
        (
                _id String,
                name String,
                outbound_id String,
                status String,
                x_org_id String,
                timestamp DateTime DEFAULT now(),
            ) 
            ENGINE = ReplacingMergeTree(timestamp)
            PRIMARY KEY (_id, x_org_id)
            ORDER BY (_id, x_org_id);
        `,
    },

    CLICKHOUSE_OPERATIONS: {
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete",
    },

    CLICKHOUSE_EVENTS: {
        ENRICHMENT_PRODUCTS: "001",
        MASTER_PRODUCTS: "002",
        TASKS: "003",
        ATTRIBUTES: "004",
        CATEGORIES: "005",
        CATEGORY_TREE: "006",
        TEMPLATE: "007",
        MAPPER: "008",
        INBOUND: "009",
        OUTBOUND: "010",
        SETTINGS: "011",
        INBOUND_LOGS: "012",
        OUTBOUND_LOGS: "013",
    },
    CLICKHOUSE_REVERSE_EVENTS: {
        "001": "ENRICHMENT_PRODUCTS",
        "002": "MASTER_PRODUCTS",
        "003": "TASKS",
        "004": "ATTRIBUTES",
        "005": "CATEGORIES",
        "006": "CATEGORY_TREE",
        "007": "TEMPLATE",
        "008": "MAPPER",
        "009": "INBOUND",
        "010": "OUTBOUND",
        "011": "SETTINGS",
    },
    AUDIT_LOG_SEARCHABLE_COLUMNS: [
        "description",
        "event_type",
        "event_code",
        "action",
        "modified_by",
    ],
    AUDIT_LOG_FILTER_MAPPINGS: {
        objectType: "event_type",
        objectCode: "event_code",
        action: "action",
        userId: "modified_by",
    },
    RD_CODES: {
        price: "10025",
        startDate: "10026",
        endDate: "10027",
        max_exchange_percentage: "10012",
        max_exchange_amount: "10014",
        RRP: "A97",
        max_lsp_price: "10013",
        deal_price_threshold: "10028",
        deal_price_timer_require: "10029",
    },
    ASSET_JOB_STATUS: {
        CREATED: "created",
        PARTIAL: "partial",
        IN_PROGRESS: "in-progress",
        SUCCESS: "success",
        FAILED: "failed",
    },
    REDIS_KEYS_PREFIX: {
        GLOBAL_MEDIA_JOB: "cc:valar:global_media_job",
    },
    BULLMQ_QUEUES: {
        MEDIA_UPLOAD_TRACKING: "mediaUploadTracking",
        MEDIA_UNZIPPER: "mediaUnzipper",
    },
    STATUS: {
        SUCCESS: "SUCCESS",
        FAILED: "FAILED"
    },
    VERTICALS,
    PRODUCT_MASTER_SYNC_TOPICS,
    getProductMasterSyncTopic,
    PRODUCT_SYNC_TOPICS,
    getProductSyncTopic,
    getProductWebhookTopicId,
};
