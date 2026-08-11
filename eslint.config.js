import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-empty": ["error", { "allowEmptyCatch": false }],
      "@typescript-eslint/no-empty-function": ["error", { "allow": ["constructors", "arrowFunctions"] }],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
  {
    files: ["src/components/**/*", "src/components/**/*.tsx", "src/components/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "firebase/app",
              message: "⚠️ توقف! لا يجوز استدعاء Firebase مباشرة في المكونات الغبية. استخدم الخدمات في src/services."
            },
            {
              name: "firebase/firestore",
              message: "⚠️ خطأ في المعمارية: الواجهة يجب ألا تعرف شيئاً عن قواعد البيانات. استخدم Hook من src/hooks."
            }
          ],
          patterns: [
            {
              group: ["**/firebaseConfigs", "firebase/*"],
              message: "المكونات يجب أن تكون Dumb. انقل هذا المنطق إلى طبقة الـ Services."
            }
          ]
        }
      ]
    }
  }
);
