const { whenDev } = require("@craco/craco");

module.exports = {
    devServer: whenDev(() => ({
        headers: {'Access-Control-Allow-Origin': '*'}
    }))
};
