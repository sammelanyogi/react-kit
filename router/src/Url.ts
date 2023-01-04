// import React from "react";
// import { Route, RouteState } from './Route.js';

// type Query = {
//   [param: string]: string;
// };

// export class UrlParser<T extends RouteState> {
//   private readonly parts: string[];
//   private readonly query: Query = {};
//   private readonly queryString: string;

//   private _matched: null | {
//     remainingUrl: string,
//     props: object,
//     route: T,
//   } = null;

//   constructor(url: string) {
//     const [urlPath, searchQueryPath] = url.split('?');
//     this.queryString = searchQueryPath;
//     this.parts = splitUrlPath(urlPath);
//     this.query = splitSearchPath(searchQueryPath);
//   }

//   get matched() {
//     return this._matched;
//   }

//   /**
//    * This is a one time function
//    * @param path 
//    * @returns 
//    */
//   use(path: string, route: T) {
//     // If the url has already been matched then skip
//     if (this._matched) return;
    
//     const parts = path.split('/').filter(k => k.trim().length > 0);
//     if (parts.length > this.parts.length) return;

//     const params: Record<string, string> = {};

//     for (let i = 0; i < parts.length; i += 1) {
//       const part = parts[i];
//       if (part.startsWith(':')) {
//         const param = part.substring(1);
//         params[param] = this.parts[i];
//       } else if (part.toLowerCase() !== this.parts[i]) {
//         return;
//       }
//     }

//     // Override the query object with params
//     const props = Object.assign({}, this.query, params);
    
//     this._matched = {
//       remainingUrl: `${this.parts.slice(parts.length).join('/')}${this.queryString ? `?${this.queryString}` : ''}`,
//       props,
//       route,
//     }
//   }
// }

// function splitUrlPath(urlPath: string) {
//   return urlPath
//     .split('/')
//     .filter(k => k.trim().length)
//     .map(k => k.trim().toLowerCase());
// }

// function splitSearchPath(search: string) {
//   if (!search) return {};

//   const searchQueryPathBroken: Record<string, string> = {};

//   search.split('&').forEach(query => {
//     const [left, right] = query.split('=');
//     searchQueryPathBroken[left] = right;
//   });

//   return searchQueryPathBroken;
// }