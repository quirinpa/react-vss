const makeConfig = require("@tty-pt/scripts/webpack.config");

module.exports = function (env) {
  let config = makeConfig({
    ...env,
    library: true,
  });

  return config;
};

