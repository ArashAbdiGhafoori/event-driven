// based on svelte source code here: https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
export function safe_not_equal(a: unknown, b: unknown) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === "object") || typeof a === "function";
}

// based on svelte source code here: https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
export function noop(): void {
  return;
}
