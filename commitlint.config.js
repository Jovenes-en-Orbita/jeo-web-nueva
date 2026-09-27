module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        // English
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        // Español
        "caracteristica",
        "correccion",
        "documentacion",
        "estilo",
        "refactorizacion",
        "rendimiento",
        "prueba",
        "ajuste",
      ],
    ],
    "subject-case": [0],
    "header-max-length": [2, "always", 120],
  },
};
