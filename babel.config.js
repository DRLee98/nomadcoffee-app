module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./app"],
          extensions: [".js", ".ios.js", ".android.js"],
        },
      ],
      ["@babel/plugin-syntax-class-properties"],
    ],
  };
};
