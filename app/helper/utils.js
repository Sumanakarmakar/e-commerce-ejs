const { promisify } = require("util");
const { stat, readdir } = require("fs");
const { join } = require("path");
const _ = require("underscore");

let Utils = {
  isDirectory: async (f) => {
    return (await promisify(stat)(f)).isDirectory();
  },
  _readdir: async (filePath) => {
    // console.log("fff", filePath);
    const files = await Promise.all(
      (
        await promisify(readdir)(filePath)
      ).map(async (f) => {
        const fullPath = join(filePath, f);
        // console.log("full", fullPath);
        return (await Utils.isDirectory(fullPath))
          ? Utils._readdir(fullPath)
          : fullPath;
      })
    );

    return _.flatten(files);
  },

};

module.exports = Utils;
