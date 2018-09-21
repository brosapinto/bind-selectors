import babel from "rollup-plugin-babel";

module.exports = {
  input: "index.js",
  output: {
    format: "cjs"
  },
  external: ["lodash.get"],
  plugins: [
    babel({
      babelrc: false,
      exclude: "node_modules"
    })
  ]
};
