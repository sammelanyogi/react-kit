/**
 * Utility function to parse the url and match it with the
 * source string.
 * 
 * @param matchString 
 * @param url 
 * @returns 
 */
export function matchUrl(matchString: string, url: string) {
  const [path, query] = url.split('?', 2);

  // Remove all empty parts (double slashes)
  const matchParts = matchString.split('/').filter(k => !!k);
  const urlParts = path.split('/').filter(k => !!k);

  if (urlParts.length < matchParts.length) return null;
  
  const params: Record<string, string> = {};
  for (let i = 0; i < matchParts.length; i += 1) {
    const matchPart = matchParts[i];
    if (matchPart.startsWith(':')) {
      params[matchPart.substring(1)] = urlParts[i];
    } else if (matchPart !== urlParts[i]) {
      return null;
    }
  }

  const queries: Record<string, string> = {};
  if (query) {
    query.split('&').forEach(q => {
      const [name, value] = q.split('=', 2);
      queries[name] = value;
    });
  }

  // The query part is forwared to all the children as well
  return {
    params: params,
    queries: queries,
    match: urlParts.slice(0, matchParts.length).join('/'),
    remaining: urlParts.slice(matchParts.length).join('/') + (query ? `?${query}` : ''),
  }
}
