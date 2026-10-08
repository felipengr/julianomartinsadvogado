// Padrão Conventional Commits: https://www.conventionalcommits.org/pt-br
// Ex.: "feat: adiciona seção de dúvidas", "fix(admin): corrige upload no iPhone"
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // A descrição pode começar com maiúscula ou minúscula (português).
    "subject-case": [0],
    "body-max-line-length": [1, "always", 100],
  },
};

export default config;
