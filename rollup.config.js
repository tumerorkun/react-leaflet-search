import fs from "fs";
import path from "path";
import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import clear from "rollup-plugin-clear";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
// import sass from "rollup-plugin-sass";
import css from "rollup-plugin-css-only";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";

const external = [...Object.keys(pkg.peerDependencies || {})];
const commonPlugins = [
    typescript({
        // typescript: require("typescript"),
        useTsconfigDeclarationDir: true,
    }),
    resolve(),
    commonjs(),
    css({
        // Write all styles to the bundle destination where .js is replaced by .css
        output: (css) =>
            postcss([autoprefixer, cssnano])
                .process(css, { from: undefined })
                .then((result) => {
                    if (!fs.existsSync(path.resolve(process.cwd(), "css"))) {
                        fs.mkdirSync(path.resolve(process.cwd(), "css"));
                    }
                    fs.writeFileSync(path.resolve(process.cwd(), "css/index.min.css"), result.css);
                })
        // Processor will be called with two arguments:
        // - style: the compiled css
        // - id: import id
        // processor: (css) =>
        //     postcss([autoprefixer, cssnano])
        //         .process(css, { from: undefined })
        //         .then((result) => fs.writeFileSync('css/index.min.css',result.css))
    }),
    terser() // minifies generated bundles
];
const plugins = [
    clear({
        // required, point out which directories should be clear.
        targets: ["es", "umd", "cjs", "lib", "types"],
        // optional, whether clear the directores when rollup recompile on --watch mode.
        watch: true // default: false
    }),
    ...commonPlugins
];

const globals = {
    leaflet: "L",
    react: "React",
    "prop-types": "PropTypes",
    "react-dom": "ReactDOM",
    "react-leaflet": "ReactLeaflet"
};

export default [
    {
        input: "src/index.ts",
        output: [
            {
                globals,
                file: "es/index.js",
                format: "es"
            }
        ],
        external,
        plugins
    },
    {
        input: "src/Search-v1.ts",
        output: [
            {
                globals,
                file: "cjs/v1/index.js",
                format: "cjs"
            }
        ],
        external,
        plugins: commonPlugins
    },
    {
        input: "src/Search-v2.ts",
        output: [
            {
                globals,
                file: "cjs/v2/index.js",
                format: "cjs"
            }
        ],
        external,
        plugins: commonPlugins
    },
    {
        input: "src/Search-v1.ts",
        output: [
            {
                globals,
                name: "ReactLeafletSearch",
                file: "umd/v1/index.js",
                format: "umd"
            }
        ],
        external,
        plugins: commonPlugins
    },
    {
        input: "src/Search-v2.ts",
        output: [
            {
                globals,
                name: "ReactLeafletSearch",
                file: "umd/v2/index.js",
                format: "umd"
            }
        ],
        external,
        plugins: commonPlugins
    }
];
