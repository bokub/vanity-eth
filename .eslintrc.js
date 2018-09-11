module.exports = {
    root: true,
    env: {
        browser: true,
    },
    "parser": "vue-eslint-parser",
    extends: [
        'plugin:vue/base',
        'plugin:vue/essential',
        'plugin:vue/strongly-recommended',
        // 'plugin:vue/recommended'
    ],
    plugins: [
        'vue',
    ],
    rules: {
        indent: 'off',
        'no-var': 'error',
        'arrow-parens': ['error', 'always'],
        'guard-for-in': 'off',
        'dot-notation': 'off',
        'no-negated-condition': 'off',
        'capitalized-comments': 'off',
        'no-prototype-builtins': 'off',
        'space-infix-ops': 'off',

        // Rules from https://github.com/vuejs/eslint-plugin-vue
        'vue/html-self-closing': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/html-quotes': 'error',
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4, {
            'baseIndent': 1,
        }],
        'vue/max-attributes-per-line': ['error', {
            'singleline': 6,
            'multiline': {
                'max': 4,
                'allowFirstLine': true
            }
        }],
        'vue/this-in-template': 'error',
    },
    globals: {},
};
