module.exports = {
    presets: [
      '@babel/preset-env',    // Para ES6+ (suporte moderno)
      '@babel/preset-react',
      "@babel/preset-typescript",  // Para suporte ao React
    ],
    plugins: [
      '@babel/plugin-transform-modules-commonjs'  // Para transformar os módulos ES para CommonJS
    ]
  };
  