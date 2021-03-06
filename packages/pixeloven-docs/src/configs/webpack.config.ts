import deepmerge from "deepmerge";
import { Configuration, Module, RuleSetRule } from "webpack";
import { resolveSourceRoot, resolveTsConfig } from "./macros";

export const newScssRule: RuleSetRule = {
    loaders: [
        require.resolve("style-loader"), 
        require.resolve("css-loader"), 
        require.resolve("sass-loader")
    ],
    test: /\.(scss|sass|css)$/i,
};

export const newTsRule: RuleSetRule = {
    include: resolveSourceRoot(),
    test: /\.(ts|tsx)$/,
    use: [
        {
            loader: require.resolve("babel-loader"),
        },
        {
            loader: require.resolve("ts-loader"),
            options: {
                configFile: resolveTsConfig(),
            },
        },
    ],
};

export const newModule: Module = {
    rules: [newScssRule, newTsRule],
};

/**
 * Extend webpack config for storybook
 * @param baseConfig
 * @param env
 * @param defaultConfig
 */
export default (
    baseConfig: Configuration,
    env: object,
    defaultConfig: Configuration,
) => {
    if (defaultConfig.module) {
        defaultConfig.module = deepmerge(defaultConfig.module, newModule);
    }
    if (defaultConfig.resolve) {
        if (defaultConfig.resolve.alias) {
            defaultConfig.resolve.alias.source = resolveSourceRoot();
        } else {
            defaultConfig.resolve.alias = {
                source: resolveSourceRoot(),
            };
        }
        if (defaultConfig.resolve.extensions) {
            defaultConfig.resolve.extensions.push(".ts", ".tsx");
        } else {
            defaultConfig.resolve.extensions = [".ts", ".tsx"];
        }
    }
    return defaultConfig;
};
