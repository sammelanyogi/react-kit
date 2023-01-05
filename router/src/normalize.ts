/**
 * Utility function to create a normalized url starting with
 * the given base and without any '..' and '.' in the path name
 * 
 * @param base 
 * @param suffix 
 * @returns 
 */
export function normalize(base: string, suffix: string) {
  const fullPath = suffix.startsWith('/') ? suffix : `${base}${suffix}`;

  const parts = fullPath.split('/');
  const final = [] as string[];
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i].trim();
    if (part === '' || part === '.') continue;
    if (part === '..') {
      final.pop();
      continue;
    }
    final.push(part);
  }
  
  return `/${final.join('/')}`;
}

