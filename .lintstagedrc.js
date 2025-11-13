module.exports = {
  // Lint & format TypeScript and JavaScript files
  '**/*.{js,jsx,ts,tsx}': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],

  // Format other files
  '**/*.{json,css,md}': (filenames) => `prettier --write ${filenames.join(' ')}`,
};
