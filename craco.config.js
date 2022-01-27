const { whenDev } = require("@craco/craco");
const webpack = require("webpack");

module.exports = {
    devServer: whenDev(() => ({
        headers: {'Access-Control-Allow-Origin': '*'}
    })),
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    process: require.resolve("process/browser"),
                    // zlib: require.resolve("browserify-zlib"),
                    // stream: require.resolve("stream-browserify"),
                    // util: require.resolve("util"),
                    buffer: require.resolve("buffer"),
                    // assert: require.resolve("assert")
                },
            },
            plugins: [
                new webpack.ProvidePlugin({
                    Buffer: ["buffer", "Buffer"],
                    process: "process/browser",
                }),
            ],
        },
    }
};
