module.exports = {
  root: true,
  extends: ['react-app', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    // Includes .prettierrc.js rules
    'prettier/prettier': 'error',
    // This rule is not compatible with Next.js's <Link /> components
    'jsx-a11y/anchor-is-valid': 'off',
    // No unused variables
    '@typescript-eslint/no-unused-vars': 'error',
    'arrow-body-style': ['error', 'as-needed'],
  },
}
