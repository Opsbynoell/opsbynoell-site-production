/**
 * ESM resolver hook used only by `npm test`.
 *
 *   1. Maps `@/...` specifiers (the tsconfig path alias) to relative
 *      imports under ./src so route-level tests can `await import`
 *      modules that use the same alias the production build uses.
 *   2. Falls back to appending `.ts` to extensionless relative imports
 *      when the original resolution fails (Next.js bundler handles
 *      that at build time; Node's native ESM resolver does not).
 */

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve as pathResolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = pathResolve(HERE, "..", "src");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const aliasPath = pathResolve(SRC_ROOT, specifier.slice(2));
    const aliasUrl = pathToFileURL(aliasPath).href;
    try {
      return await nextResolve(aliasUrl, context);
    } catch (err) {
      if (err?.code === "ERR_MODULE_NOT_FOUND") {
        return nextResolve(aliasUrl + ".ts", context);
      }
      throw err;
    }
  }
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (
      err?.code === "ERR_MODULE_NOT_FOUND" &&
      (specifier.startsWith("./") || specifier.startsWith("../"))
    ) {
      return nextResolve(specifier + ".ts", context);
    }
    throw err;
  }
}
