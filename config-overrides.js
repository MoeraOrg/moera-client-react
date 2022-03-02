const webpack = require("webpack");

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
    }
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]

    // As of 2022/03/02 webpack config provided by react-scripts breaks cjs modules. Here's hack for now.
    // Should be removed when https://github.com/facebook/create-react-app/pull/12021 will be merged
    if (config.module.rules[1].oneOf[4].test.source === '\\.(js|mjs)$') {
        config.module.rules[1].oneOf[4].test = /\.(js|mjs|cjs)$/;
    } else {
        throw new Error("Moera custom fix for cjs modules in react-scripts 5 is out of date." +
            "Please remove or update it.");
    }

    return config
}