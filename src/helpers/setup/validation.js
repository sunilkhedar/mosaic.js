const validateConfigExists = (config) => {
  if (!config) {
    throw new Error('Mandatory parameter "config" missing.');
  }
};

const validateConfigKeyExists = (config, key, configName) => {
  if (!config[key]) {
    throw new Error(
      `Mandatory configuration "${key}" missing. Set ${configName}.${key} address`,
    );
  }
};

module.exports = {
  validateConfigExists,
  validateConfigKeyExists,
};
