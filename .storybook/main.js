const path = require("path");

module.exports = {
  stories: [
    "../stories/intro/*.stories.@(ts|tsx|js|jsx|mdx)",
    "../stories/**/*.stories.@(ts|tsx|js|jsx|mdx)",
    "../src/**/*.stories.@(ts|tsx|js|jsx|mdx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-knobs/register",
    "@storybook/addon-viewport/register",
    {
      name: "@storybook/preset-create-react-app",
      options: {
        tsDocgenLoaderOptions: {},
        "craOverrides": {
          "fileLoaderExcludes": ["less"]
        }
      }
    },
    {
      name: "@storybook/addon-docs",
      options: {
        configureJSX: true
      }
    }
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true
          }
        }
      ],
      include: path.resolve(__dirname, "../")
    });

    // Return the altered config
    return config;
  }
};
