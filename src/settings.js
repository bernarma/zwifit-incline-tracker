let yaml = require("js-yaml"),
  fs = require("fs"),
  path = require("path");

/*
 Public API.
 */
exports.version = 1;
exports.maxIncline = 0.0;
exports.minIncline = 12.0;

exports.load = load;
exports.toJSON = toJSON;
exports.fromJSON = fromJSON;
exports.save = save;

/*
 Initialization.
 */
let minimumVersion = 1,
  ref = path.join(__dirname, "..", "settings.conf");

/*
 Implementation.
 */

function load() {
  if (!fs.existsSync(ref)) {
    return false;
  }
  try {
    let settings = yaml.safeLoad(fs.readFileSync(ref, "UTF-8"));
    if (settings) {
      if (settings.version && settings.version < minimumVersion) {
        console.log("New settings have been added!");
        settings = null;
      } else {
        fromJSON(settings);
      }
    }
    return !!settings;
  } catch (err) {
    return false;
  }
}

function toJSON() {
  let settings = {};
  for (let key in exports) {
    if (exports.hasOwnProperty(key) && typeof exports[key] !== "function") {
      settings[key] = exports[key];
    }
  }
  return settings;
}

function fromJSON(json) {
  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      exports[key] = json[key];
    }
  }
}

function save() {
  fs.writeFile(ref, yaml.dump(toJSON()), "UTF-8", () => {});
}
