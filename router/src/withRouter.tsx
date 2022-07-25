import React, { useEffect, useState } from "react";
import { RouterContext } from "./context.js";
import { UrlParser } from "./Url.js";

export function withRouter<T extends {}>(App: React.FC<T>, getInitialUrl?: () => Promise<string>) {
  return (props: T) => {
    // Add a state to detect the initial url
    const [url, setUrl] = useState<null | UrlParser>(getInitialUrl ? null : UrlParser.create('/'));
    const [rootRouter] = useState(() => {
      return {
        show() {
          console.error(new Error(`Root level router doesn't support displaying routes directly`));
        },
        push(url: string) {
          setUrl(UrlParser.create(url));
        },
        pop() {
          setUrl(UrlParser.create('/'));
        },
        reset() {}
      }
    });

    useEffect(() => {
      if (getInitialUrl) {
        getInitialUrl().then(url => setUrl(UrlParser.create(url || '/')));
      }
    }, []);
    // When loading the initial url, avoid rendering the app
    if (!url) return null;
    
    return (
      <RouterContext.Provider value={{ router: rootRouter, url }}>
        <App {...props} />
      </RouterContext.Provider>
    );
  }
}
