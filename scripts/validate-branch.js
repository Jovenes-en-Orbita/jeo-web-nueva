const { execSync } = require("child_process");

// 1. Obtener la rama actual
let currentBranch = "";
try {
  currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf8",
  }).trim();
} catch (error) {
  console.error("Error al obtener el nombre de la rama actual.");
  process.exit(1);
}

// Permitir llamadas directas sin rama (ej. HEAD desvinculado) o en pipelines especiales
if (!currentBranch || currentBranch === "HEAD") {
  process.exit(0);
}

// 2. Prohibir git push directo a ramas principales protegidas
const protectedBranches = ["main", "master", "develop"];
if (protectedBranches.includes(currentBranch)) {
  console.error(`\n ERROR DE GIT HOOK (pre-push):`);
  console.error(
    `Está prohibido hacer push directo a la rama '${currentBranch}'.`,
  );
  console.error(
    `Por favor, crea una subrama derivada de 'develop' y abre un Pull Request / Merge Request.\n`,
  );
  process.exit(1);
}

// 3. Expresión regular para validar el nombre de las subramas en Inglés y Español
// Formato aceptado: <tipo>/<descripcion-corta>
// Tipos aceptados (Inglés y Español):
// EN: feature, feat, fix, bugfix, refactor, chore, docs, hotfix, test
// ES: caracteristica, correccion, refactorizacion, ajuste, documentacion, prueba
const branchPattern =
  /^(feature|feat|caracteristica|fix|bugfix|correccion|refactor|refactorizacion|chore|ajuste|docs|documentacion|hotfix|test|prueba)\/[a-z0-9._-]+$/i;

if (!branchPattern.test(currentBranch)) {
  console.error(`\n ERROR DE NOMENCLATURA DE RAMA (pre-push):`);
  console.error(
    `El nombre de la rama '${currentBranch}' no cumple con los estándares requeridos.`,
  );
  console.error(
    `Las subramas deben ser derivadas de 'develop' y seguir el formato:`,
  );
  console.error(`   <tipo>/<nombre-descriptivo>`);
  console.error(`\nEjemplos aceptados:`);
  console.error(
    `   - feature/login-page        o   caracteristica/login-usuario`,
  );
  console.error(
    `   - fix/auth-header-token     o   correccion/token-autenticacion`,
  );
  console.error(
    `   - refactor/prisma-queries   o   refactorizacion/consultas-prisma`,
  );
  console.error(
    `   - chore/update-deps         o   ajuste/actualizar-dependencias`,
  );
  console.error(
    `   - docs/readme-update        o   documentacion/actualizar-readme\n`,
  );
  process.exit(1);
}

// 4. Verificar que la rama se haya derivado / tenga ancestro en 'develop' si la rama develop existe localmente o en origin
try {
  const hasDevelop = execSync("git rev-parse --verify develop", {
    stdio: "ignore",
  });
  // Si develop existe localmente, verificar si la rama comparte punto de origen (merge-base)
  const mergeBase = execSync(`git merge-base develop ${currentBranch}`, {
    encoding: "utf8",
  }).trim();
  if (!mergeBase) {
    console.warn(
      `Advertencia: No se pudo verificar la base de divergencia con la rama 'develop'.`,
    );
  }
} catch (e) {
  // develop no existe localmente aún, omitimos la verificación de merge-base sin fallar
}

console.log(`Rama '${currentBranch}' validada correctamente.`);
process.exit(0);
