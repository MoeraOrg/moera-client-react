const { whenDev } = require("@craco/craco");
const webpack = require("webpack");

module.exports = {
    devServer: whenDev(() => ({
        headers: {'Access-Control-Allow-Origin': '*'}
    }))
};
