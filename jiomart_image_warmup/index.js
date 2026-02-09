"use strict";
const logger = require("../../common/logger");
const Sentry = require("../../connections/sentry");
const { JIOMART_IMAGE_WARMUP } = require("../../common/constants");
const { startConsumer } = require("../../kafka/consumer");
const { onConsumeSingleMessage } = require("./processor.js");

startConsumer(JIOMART_IMAGE_WARMUP, "single", onConsumeSingleMessage)
    .then(() => {
        logger.info(`Jiomart Image Warmup Consumer connected and started`);
    })
    .catch((e) => {
        logger.error(`Error starting jiomart image warmup consumer`, e);
        Sentry.captureException(e);
        process.exit(1);
    });
