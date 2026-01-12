function splitUrlParts(input: string): { pathname: string; search: string; hash: string } {
  const hashIndex = input.indexOf("#");
  const beforeHash = hashIndex >= 0 ? input.slice(0, hashIndex) : input;
  const hash = hashIndex >= 0 ? input.slice(hashIndex) : "";

  const searchIndex = beforeHash.indexOf("?");
  const pathname = searchIndex >= 0 ? beforeHash.slice(0, searchIndex) : beforeHash;
  const search = searchIndex >= 0 ? beforeHash.slice(searchIndex) : "";

  return { pathname, search, hash };
}

export function withTrailingSlash(input: string): string {
  if (!input) return input;

  try {
    const url = new URL(input);
    url.pathname = withTrailingSlash(url.pathname);
    return url.toString();
  } catch {
    // not a full URL
  }

  const { pathname, search, hash } = splitUrlParts(input);
  if (!pathname || pathname === "/") return `/${search}${hash}`;
  const normalizedPathname = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${normalizedPathname}${search}${hash}`;
}

