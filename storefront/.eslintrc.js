module.exports = {
  extends: ["next/core-web-vitals"],
  settings: {
    next: {
      rootDir: "src"
    }
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-page-custom-font": "off",
    "@next/next/no-typos": "off",
    "@next/next/no-duplicate-head": "off",
    "@next/next/no-before-interactive-script-outside-document": "off",
    "@next/next/no-styled-jsx-in-document": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "off",
  }
};