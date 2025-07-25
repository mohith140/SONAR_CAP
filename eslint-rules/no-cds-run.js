module.exports = {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow use of cds.run()',
        category: 'Best Practices',
      },
      messages: {
        avoidCdsRun: 'Avoid using cds.run(). Use a custom service method instead.',
      },
    },
    create(context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === 'MemberExpression' &&
            node.callee.object.name === 'cds' &&
            node.callee.property.name === 'run'
          ) {
            context.report({
              node,
              messageId: 'avoidCdsRun',
            });
          }
        },
      };
    },
  };
  