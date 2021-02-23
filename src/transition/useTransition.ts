import { useEffect, useRef } from 'react';
import { Controller } from './Controller.js';

import { MapState } from './types.js';

export function createTransitionHook<S, A>(controller: Controller<S, A>) {
  return function useTransition<R>(mapState: MapState<S, R>, transition: (param: R) => Promise<any>) {
    const ref = useRef<{ transition: (param: R) => Promise<any>, value?: R }>();
    if (!ref.current) {
      ref.current = { transition };
    } else {
      ref.current.transition = transition;
    }

    useEffect(() => {
      function callback(state: S, prevState: S): void {
        const next = mapState(state, prevState);
        if (next === ref.current.value) return;

        ref.current.value = next;

        // Start the animation
        const transitionAnim = ref.current.transition(next);
        if (transitionAnim) {
          controller.setup(transitionAnim);
        }
      }

      // Check if the animation needs to run on mount
      callback(controller.getState(), controller.getPrevState());

      return controller.registerTransition(callback);
    }, [mapState]);
  };
}
