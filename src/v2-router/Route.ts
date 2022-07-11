import React from 'react';
import { Router } from './Router.js';

type Component<P extends {}> = React.FC<P>;

/**
 * An immuatable Route structure that can be rendered
 * via react.
 */
export class Route<P extends {} = any> {
  readonly router: Router;
  readonly component: Component<P>;
  readonly props?: P;

  constructor(router: Router, component: Component<P>, props?: P) {
    this.router = router;
    this.component = component;
    this.props = props;
  }

  /**
   * Create react element for rendering
   */
  createElement() {
    return React.createElement(this.component, this.props);
  }
}
