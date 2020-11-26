import React from 'react';

type Component<P extends {}> = React.FC<P>;

/**
 * An immuatable Route structure that can be rendered
 * via react.
 */
export class Route<P extends {} = any> {
  private readonly component: Component<P>;
  private readonly props?: P;

  constructor(component: Component<P>, props?: P) {
    this.component = component;
    this.props = props;
  }

  /**
   * Create react element for rendering
   */
  createElement() {
    return React.createElement(this.component, this.props);
  }

  /**
   * Check if this route identifies as the given Component
   * @param comp
   */
  is(comp: Component<P>) {
    return this.component === comp;
  }

   /**
   * Check if this route identifies as the given Route
   * @param route
   */
  equals(route: Route) {
    return route && this.component === route.component;
  }
}
