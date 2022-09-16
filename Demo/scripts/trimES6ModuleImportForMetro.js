const babelTransformer = require('metro-react-native-babel-transformer');

function fixArg(arg) {
  if (arg.value.endsWith('.js')) {
    arg.value = arg.value.substr(0, arg.value.length - 3);
  }
}

module.exports.transform = function trimES6ModuleImportForMetro({
  src,
  filename,
  options,
}) {
  const result = babelTransformer.transform({src, filename, options});
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
    // Replace all '.js' import to remove '.js'
    result.ast.program.body.forEach(parts => {
      // Fix imports of type -- var x = require('./module.js');
      // The babel transformation would have already transformed
      // import to require
      if (parts.type === 'VariableDeclaration') {
        parts.declarations.map(d => {
          if (
            d.type === 'VariableDeclarator' &&
            d.init &&
            d.init.type === 'CallExpression'
          ) {
            if (d.init.callee.name === 'require') {
              fixArg(d.init.arguments[0]);
            } else if (d.init.callee.name === '_interopRequireDefault') {
              fixArg(d.init.arguments[0].arguments[0]);
            }
          }
        });
        // Fix imports of type -- require('./module.js'); // without variable assignment
      } else if (
        parts.type === 'ExpressionStatement' &&
        parts.expression.type === 'CallExpression' &&
        parts.expression.callee.name === 'require'
      ) {
        fixArg(parts.expression.arguments[0]);
        // Fix imports that have not been transformed to require
      } else if (
        parts.type === 'ImportDeclaration' ||
        parts.type === 'ExportNamedDeclaration' ||
        parts.type === 'ExportAllDeclaration'
      ) {
        if (parts.source) {
          fixArg(parts.source);
        }
      }
    });
  }
  return result;
};
