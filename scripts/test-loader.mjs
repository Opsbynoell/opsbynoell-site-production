/**
 * Minimal ESM resolver hook for `node --test` with TypeScript sources.
 *
 * Node's native ESM resolver requires explicit extensions, but our
 * source files use extensionless relative imports (resolved at build
 * time by the Next.js bundler). This hook falls back to appending
 * `.ts` when the original specifier fails to resolve, so tests can
 * run without any bundler or new dependencies.
 */
import { register } from "node:module";

register(new URL("./test-resolve-hook.mjs", import.meta.url));
