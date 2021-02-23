import { Context, useContext, useState, useEffect, useRef } from 'react';
import { Controller } from './Controller.js';

export function createTransitionStateHook<S, A>(controller: Controller<S, A>) {
  return function useTransitionState<R>(mapState: (state: S, prevState: S, prevValue: R) => R): R {
    const [result, setResult] = useState(() => mapState(controller.getState(), controller.getPrevState(), undefined));

    useEffect(() => {
      let prev = result;

      function cb(state: S, prevState: S) {
        const k = mapState(state, prevState, prev);
        if (k === undefined) {
          console.log('Nothing returned from mapState of useTransitionState.');
        }
        if (k === prev) return;
        prev = k;
        setResult(k);
      }

      return controller.registerListener(cb);
    }, [mapState]);

    return result;
  };
}
