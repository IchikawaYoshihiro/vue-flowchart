import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
export default {
  input: 'src/wrapper.js',
  output: {
    name: 'VueFlowchart',
    exports: 'named',
  },
  plugins: [
    commonjs(),
    vue({
      css: true,
      compileTemplate: true,
    }),
  ],
};
