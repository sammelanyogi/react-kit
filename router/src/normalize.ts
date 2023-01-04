/**
 * Utility function to create a normalized url starting with
 * the given base and without any '..' and '.' in the path name
 * 
 * @param base 
 * @param suffix 
 * @returns 
 */
export function normalize(base: string, suffix: string) {
  if (suffix.startsWith('/')) return suffix;
  const fullPath = `${base}${suffix}`;

  //TODO: Remove all './' and '../'
  return fullPath;
}
