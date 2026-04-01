// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Required for Drizzle ORM migrations — transform .sql files as string-exporting JS modules
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "sql");
config.resolver.sourceExts.push("sql");
config.transformer.babelTransformerPath = require.resolve("./sql-transformer.js");

module.exports = config;
