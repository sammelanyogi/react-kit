type Query = {
  [param: string]: string;
};

export class Url {
  readonly parts: string[];
  query: Query;

  remaining?: string[];

  constructor(uri: string | Url) {
    if (typeof uri === 'string') {
      this.parts = uri
        .split('/')
        .filter(k => k.trim().length)
        .map(k => k.trim().toLowerCase());
      this.query = {};
    } else {
      this.parts = uri.remaining || [];
      this.query = uri.query;
    }
  }

  match(path: string) {
    // Check if the url has already been used
    if (this.remaining) return null;

    const parts = path.split('/').filter(k => k.trim().length > 0);
    if (parts.length === 0) return null;
    if (parts.length > this.parts.length) return null;

    const params = Object.assign({}, this.query);

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (part.startsWith(':')) {
        const param = part.substring(1);
        params[param] = this.parts[i];
      } else if (part.toLowerCase() !== this.parts[i]) {
        return null;
      }
    }

    this.query = params;

    // We have matched the url, this url should not
    // be usable any more
    this.remaining = this.parts.slice(parts.length);
    return params;
  }

  isRemaining = () => {
    if (!this.remaining || !this.remaining.length) return false;
    return true;
  };

  equals(uri: string) {
    return uri === this.parts.join('/');
  }
}
