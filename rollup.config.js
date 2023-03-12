import copy from "rollup-plugin-copy";

module.exports = {
  input: "game3.js",
  output: {
    dir: "dist",
  },
  treeshake: false,
  plugins: [
    copy({
      targets: [{ src: "index.html", dest: "dist" }],
    }),
  ],
};
