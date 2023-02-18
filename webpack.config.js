const makeConfig = require("@tty-pt/scripts/webpack.config");

module.exports = function (env) {
  let config = makeConfig({
    ...env,
    entry: "index.tsx",
    library: true,
  });

  return config;
};

