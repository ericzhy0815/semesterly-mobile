const upstreamTransformer = require("@expo/metro-config/babel-transformer");

module.exports.transform = async ({ src, filename, options }) => {
  if (filename.endsWith(".sql")) {
    return upstreamTransformer.transform({
      src: `module.exports = ${JSON.stringify(src)};`,
      filename: filename.replace(".sql", ".js"),
      options,
    });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
