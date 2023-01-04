/**
 * Utility function to parse the url and match it with the
 * source string.
 * 
 * @param matchString 
 * @param url 
 * @returns 
 */
export function matchUrl(matchString: string, url: string) {
  console.log('MatchUrl', matchString, url);
  if (!url.startsWith(matchString)) return null;
  
  // TODO: parse the url into params, queries, match and remaining
  const match = matchString;
  const remaining = url.substring(match.length + 1);

  return {
    params: {},
    queries: {},
    match,
    remaining,
  }
}
