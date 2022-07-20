import { Router } from './Router.js';

export class Url {
  private readonly parts: Array<string>;
  private readonly query: object;

  private remaining: Array<string> | null;

  constructor(uri: string | Url) {
    // Divide the uri into multiple parts and avoid any 
    // empty strings arising mostly due to initial `/` or
    // multiple `//`
    if (typeof uri === 'string') {
      this.parts = uri.split('/').filter(k => k.length > 0);
      this.query = {};
    } else {
      this.parts = uri.remaining;
      this.query = uri.query;
    }
  }

  match(path: string) {
    // If the remainig parts have been set, then we cannot
    // use the url any more
    if (this.remaining) return;

    const parts = path.split('/').filter(k => k.length > 0);

    // Some path is required for matching, we can't match to '/' 
    if (parts.length === 0) return;
    
    // If we don't have enough parts in the uri, then its a no match
    if (parts.length > this.parts.length) return;

    // Assume we got a match
    const params: {[param: string]: string} = Object.assign({}, this.query);
    
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      // We got a param to match
      if (part.startsWith(':')) {
        params[part.substring(1)] = this.parts[i];
      } else if (parts[i] !== this.parts[i]) {
        // path mismatch, cannot continue
        return;
      }
    }

    return params;
  }

  getRemainingUrl(router: Router) {
    if (!this.remaining) return null;
    return new Url(this);
  }
}