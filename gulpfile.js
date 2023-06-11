const { src, dest, watch, series, task } = require("gulp");
const shell = require("gulp-shell");

task("build", shell.task("npx rollup --config rollup.config.js"));
task("test", shell.task("npx jest"));
