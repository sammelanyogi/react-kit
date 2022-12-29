import { MapRequest } from './Route.js';

export class UrlParser<T> implements MapRequest {
  private readonly parts: string[];
  readonly query: Record<string, string>;
  readonly param: Record<string, string>;
  
  private readonly queryString: string;

  private _matched: null | {
    remainingUrl: string,
    route: T,
  } = null;

  constructor(url: string) {
    const [urlPath, searchQueryPath] = url.split('?');
    this.queryString = searchQueryPath;
    this.parts = splitUrlPath(urlPath);
    this.query = splitSearchPath(searchQueryPath);
    this.param = {};
  }

  get matched() {
    return this._matched;
  }

  /**
   * This is a one time function
   * @param path 
   * @returns 
   */
  use(path: string, createRoute: (req: MapRequest) => T) {
    // If the url has already been matched then skip
    if (this._matched) return;
    
    const parts = path.split('/').filter(k => k.trim().length > 0);
    if (parts.length > this.parts.length) return;

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (part.startsWith(':')) {
        const param = part.substring(1);
        this.param[param] = this.parts[i];
      } else if (part.toLowerCase() !== this.parts[i]) {
        return;
      }
    }

    this._matched = {
      remainingUrl: `${this.parts.slice(parts.length).join('/')}${this.queryString ? `?${this.queryString}` : ''}`,
      route: createRoute(this),
    }
  }
}

function splitUrlPath(urlPath: string) {
  return urlPath
    .split('/')
    .filter(k => k.trim().length)
    .map(k => k.trim().toLowerCase());
}

function splitSearchPath(search: string) {
  if (!search) return {};

  const searchQueryPathBroken: Record<string, string> = {};

  search.split('&').forEach(query => {
    const [left, right] = query.split('=');
    searchQueryPathBroken[left] = right;
  });

  return searchQueryPathBroken;
}