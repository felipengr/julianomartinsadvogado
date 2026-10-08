// Roda antes de cada commit, só nos arquivos alterados.
const config = {
  "*.{ts,tsx,js,mjs}": "eslint --fix",
};

export default config;
