/**
 * ESM resolver hook: falls back to `.ts` for extensionless relative
 * imports when the original resolution fails. Used only by `npm test`.
 */
export async function resolve(specifier, context, nextResolve) {
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
