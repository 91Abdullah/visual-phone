const CracoLessPlugin = require('craco-less');

// #02AA31
// #d32f2f

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#02AA31', '@secondary-color': '#aa00ff' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};