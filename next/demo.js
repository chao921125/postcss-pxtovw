// postcss.config.js
const pxToRemVW = require('./postcss-px-to-rem-vw');

module.exports = {
    plugins: [
        pxToRemVW({
            rootValue: 16,
            viewportWidth: 375,
            unitPrecision: 5,
            propListRem: ['*', '!width', '!height', '!min-width', '!max-width'],
            propListVW: ['width', 'height', 'margin', 'padding'],
            selectorBlackListRem: ['.use-vw'],
            selectorBlackListVW: ['.use-rem'],
            minPixelValue: 1,
        }),
    ],
};
