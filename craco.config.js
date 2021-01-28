const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#d32f2f', '@secondary-color': '#aa00ff' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};