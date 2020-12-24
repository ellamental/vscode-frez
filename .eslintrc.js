// The TypeScript project's config:
//     https://github.com/microsoft/TypeScript/blob/master/.eslintrc.json
//
// Using ESLint and Prettier in a TypeScript Project
//     https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project
//


module.exports = {
    // ignorePatterns: ["temp.js", "**/vendor/*.js"],  // example
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
    ],
    // extends: [  // yells at me about needing a path to a file...
    //     "eslint:recommended",
    //     "plugin:@typescript-eslint/eslint-recommended",
    //     "plugin:@typescript-eslint/recommended",
    //
    //     "plugin:react/recommended",  // For React projects
    // ],
    rules: {
      // Use a consistent naming convention
      //
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
      //
      "@typescript-eslint/naming-convention": "warn",

        // Enforce a clean style for interfaces and types
        // Example:
        //
        //     type FooBar = { name: string, greet(): string }
        //
        //     interface Foo {
        //         name: string
        //         greet(): void
        //     }
        //
        //     type Bar = {
        //         name: string
        //         greet(): void
        //     }
        //
        "@typescript-eslint/member-delimiter-style": ["error", {
            multiline: {
                delimiter: 'none',    // 'none' or 'semi' or 'comma'
                requireLast: true,
            },
            singleline: {
                delimiter: 'comma',    // 'semi' or 'comma'
                requireLast: false,
            },
        }],

        // TODO(nick): Specify brace style... I think "my style" is "the one
        // true brace style" or something like that.
        //
        // "@typescript-eslint/brace-style": ["error", "stroustrup", { "allowSingleLine": true }],

        // Disallow semicolons
        //
        // The `no-unexpected-multiline` protects us from (most of) the common
        // errors that occur from not using semicolons.
        //
        "no-unexpected-multiline": "error",
        "semi": "off",  // The default rule conflicts
        "@typescript-eslint/semi": ["error", "never"],

        // Require trailing commas on multiline statements.
        //
        // http://eslint.org/docs/rules/comma-dangle
        //
        "comma-dangle": ["error", "always-multiline"],

        // Require curly braces everywhere
        //
        // https://eslint.org/docs/rules/curly
        //
        "curly": ["error", "all"],

        // Require `===` and `!==`
        //
        // https://eslint.org/docs/rules/eqeqeq
        //
        "eqeqeq": "error",

        // Require `throw new Error` instead of `throw "something"`
        //
        // https://eslint.org/docs/rules/no-throw-literal
        //
        "no-throw-literal": "warn",
    },
}


/*
// My `.eslintrc` config from previous projects (~2016-2018).
// I'm not sure how much of this is valid anymore, or applicable to TypeScript.


// ESLint Configuration
// ====================

{
    // http://eslint.org/docs/user-guide/migrating-to-1.0.0.html#all-rules-off-by-default
    //
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    // "extends": "eslint:recommended",


    // http://eslint.org/docs/user-guide/configuring.html#specifying-environments
    //
    "env": {
        "browser": true,

        // Allows `require` and `define` as globals.
        //
        "amd": true,

        // Allows es6 globals (Promise, Map, Set, etc.)
        // http://eslint.org/docs/user-guide/migrating-to-2.0.0#built-in-global-variables
        //
        "es6": true,
    },


    // http://eslint.org/docs/user-guide/configuring.html#specifying-language-options
    //
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
    },

    // http://eslint.org/docs/user-guide/configuring.html#specifying-parser
    //
    "parser": "babel-eslint",


    // http://eslint.org/docs/user-guide/configuring.html#configuring-plugins
    //
    "plugins": [
        "react"
    ],

    // "settings": {
    //   "react": {
    //   },
    // },


    // http://eslint.org/docs/user-guide/configuring.html#configuring-rules
    //
    "rules": {
        // Format:
        // "name": [severity(0|1|2), "parameter"]
        //     severity:
        //         0 - off
        //         1 - warning
        //         2 - error


        // Require trailing commas on multiline statements.
        //
        // http://eslint.org/docs/rules/comma-dangle
        //
        "comma-dangle": [2, "always-multiline"],


        // Enforce consistent indentation
        //
        // http://eslint.org/docs/rules/indent
        //
        // [severity, number-of-spaces]
        //
        "indent": [2, 2, { SwitchCase: 1 }],


        // Require "strict mode" to be used globally.
        //
        // http://eslint.org/docs/rules/strict
        //
        "strict": [2, "global"],


        // Require a single space after opening comments.
        //
        // http://eslint.org/docs/rules/spaced-comment
        //
        "spaced-comment": [2, "always"],

        // < 80 character lines.
        //
        // http://eslint.org/docs/rules/max-len.html
        //
        // [severity, max-characters, tab=num-characters]
        //
        "max-len": [2, 80, 4],


        // Allow console.* statements.
        //
        // http://eslint.org/docs/rules/no-console
        //
        // TODO(nick): This should probably be turned back on for "production"
        // builds.
        //
        "no-console": 0,


        // Disallow unused variables, but allow unused parameters.
        //
        // http://eslint.org/docs/rules/no-unused-vars
        //
        "no-unused-vars": [2, {"vars": "all",
                               "args": "none"}],

        // Allow "dangerouslySetInnerHTML".  It's already obvious enough.
        //
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
        //
        "react/no-danger": 0,

    }
}


*/