const postcss = require('postcss');
// @ts-ignore
// import postcss from "postcss";

module.exports = postcss.plugin('postcss-px-to-rem-vw', (options = {}) => {
    // 默认配置
    const defaultOptions = {
        rootValue: 16, // 转换为 rem 的基准值
        viewportWidth: 375, // 转换为 vw 的设计稿宽度
        unitPrecision: 5, // 小数位数
        propListRem: ['*', '!width', '!height', '!min-width', '!max-width'], // 转换为 rem 的属性
        propListVW: ['width', 'height', 'margin', 'padding'], // 转换为 vw 的属性
        selectorBlackListRem: ['.use-vw'], // 不转换为 rem 的选择器
        selectorBlackListVW: ['.use-rem'], // 不转换为 vw 的选择器
        minPixelValue: 1, // 小于或等于这个值的不转换
    };

    // 合并用户配置和默认配置
    const opts = { ...defaultOptions, ...options };

    // 判断属性是否符合转换列表
    const satisfyPropList = (prop, propList) => {
        return propList.some(rule => rule === '*' || prop.startsWith(rule.replace('!', '')));
    };

    // 判断是否为黑名单选择器
    const blacklistedSelector = (selector, selectorBlackList) => {
        return selectorBlackList.some(blacklist => selector.includes(blacklist));
    };

    // px 转 rem
    const pxToRem = (pxValue) => {
        return `${(parseFloat(pxValue) / opts.rootValue).toFixed(opts.unitPrecision)}rem`;
    };

    // px 转 vw
    const pxToVw = (pxValue) => {
        return `${(parseFloat(pxValue) / opts.viewportWidth * 100).toFixed(opts.unitPrecision)}vw`;
    };

    // 插件主逻辑
    return (root) => {
        root.walkDecls(decl => {
            const { prop, value } = decl;

            // 跳过不包含 px 的值
            if (!value.includes('px')) return;

            // 获取父选择器
            const parentSelector = decl.parent.selector;

            // 判断是否符合 rem 转换条件
            const shouldConvertToRem =
                satisfyPropList(prop, opts.propListRem) &&
                !blacklistedSelector(parentSelector, opts.selectorBlackListRem);

            // 判断是否符合 vw 转换条件
            const shouldConvertToVW =
                satisfyPropList(prop, opts.propListVW) &&
                !blacklistedSelector(parentSelector, opts.selectorBlackListVW);

            // 根据条件进行 px 转换
            if (shouldConvertToRem) {
                decl.value = decl.value.replace(/(\d*\.?\d+)px/g, (match, p1) => {
                    if (parseFloat(p1) <= opts.minPixelValue) return match;
                    return pxToRem(p1);
                });
            } else if (shouldConvertToVW) {
                decl.value = decl.value.replace(/(\d*\.?\d+)px/g, (match, p1) => {
                    if (parseFloat(p1) <= opts.minPixelValue) return match;
                    return pxToVw(p1);
                });
            }
        });
    };
});
