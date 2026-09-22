/** Real id from the URL. Static HTML is generated for `_` and reused for any id. */
export function routeParamId(pathname: string | null | undefined): string | undefined {
  if (!pathname) return undefined;
  const parts = pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  if (!last || last === '_') return undefined;
  return last;
}
