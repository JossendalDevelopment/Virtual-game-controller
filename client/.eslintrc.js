module.exports = {
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        // 'plugin:vue/recommended',
        'plugin:vue/base'
    ],
    rules: {
        'no-console': 'off',
    },
};