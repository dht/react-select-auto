const { src, dest, parallel, series } = require("gulp");
const exec = require("child_process").exec;
const rename = require("gulp-rename");

function config() {
  return src("./package.json").pipe(dest("build"));
}

function babel(cb) {
  exec("npx babel src --out-dir build", { cwd: "." }, function(
    err,
    stdout,
    stderr
  ) {
    cb(err);
  });
}

function main() {
  return src("./build/main.js")
    .pipe(rename("index.js"))
    .pipe(dest("build"));
}

function publish(cb) {
  exec("npm publish", { cwd: "./build" }, function(err, stdout, stderr) {
    cb(err);
  });
}

exports.config = config;
exports.babel = babel;
exports.main = main;
exports.publish = publish;

exports.default = series(parallel(config), babel, main);
