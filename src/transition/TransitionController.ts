import { createElement, useEffect, useState, ComponentType } from "react";

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type Anim = {
  start: (cb: (param: { finished: boolean }) => void) => void,
  stop: () => void,
};

export type Transition<State, Action> = (action: Action, nextState: State, prevState: State) => null | Anim | Anim[];

export type MapState<State, Result> = (nextState: State, prevState: State) => Result;

function subscribe<K>(array: Array<K>, fn: K) {
  array.unshift(fn);
  return () => {
    const idx = array.indexOf(fn);
    if (idx >= 0) {
      array.splice(idx, 1);
    }
  }
}

export class TransitionController<State, Action> {
  private readonly reducer: Reducer<State, Action>
  private currentState: State;
  private readonly queue: Array<Action> = [];
  private running: boolean = false;

  private aborted: boolean = false;

  private stateUpdates: Array<MapState<State, any>> = [];

  private unmounts: Transition<State, Action>[] = [];
  private transitions: Transition<State, Action>[] = [];
  private mounts: Transition<State, Action>[] = [];
  private backLogs: Array<() => void> = [];

  private currentAnims: Anim[];
  private holdingAnims: Anim[] = [];
  private reactBatchedUpdates: (fn: () => void) => void;

  constructor(reducer: Reducer<State, Action>, reactBatchedUpdates?: (fn: () => void) => void) {
    this.reducer = reducer;
    this.reactBatchedUpdates = reactBatchedUpdates || ((fn: () => void) => {
      fn();
    });
  }

  reset(initialState: State) {
    // Make sure we start fresh, and run all the mounting at this point
    this.currentState = initialState;

    // Abort any transitions that are running
    if (this.running) {
      this.abort();
    }

    // Run all the mounting actions
    this.updateState(this.currentState, this.currentState);
  }

  getState() {
    return this.currentState;
  }

  private abort() {
    // Set the abort flag
    this.aborted = true;

    // Clean up the queue
    this.queue.length = 0;

    // If there are any animations running, stop them
    if (this.currentAnims) {
      this.currentAnims.forEach(anim => anim.stop());
    }
  }

  catchup() {
    // Set the abort flag
    this.aborted = true;

    // Stop any running animations
    if (this.currentAnims) {
      this.currentAnims.forEach(anim => anim.stop());
    }
  }

  private shouldHoldAction() {
    return this.running || this.holdingAnims.length > 0;
  }

  dispatch(action: Action) {
    if (this.shouldHoldAction()) {
      // In case of a queue, push the action to run later
      this.queue.push(action);
      this.backLogs.forEach(cb => cb());
    } else {
      // Initiate a dispatch, if it's not running
      this.startDispatch(action, this.currentState);
    }
  }

  hold(animations: Array<Anim>) {
    // If a transition is in process, then it's not
    // possible to hold the animations
    animations.forEach((anim) => {
      if (!anim) return;
      this.holdingAnims.push(anim);
      anim.start(() => {
        const idx = this.holdingAnims.indexOf(anim);
        if (idx >= 0) {
          this.holdingAnims.splice(idx, 1);
          if (this.holdingAnims.length === 0 && this.queue.length) {
            this.startDispatch(this.queue.shift(), this.currentState);
          }
        }
      });
    });
  }

  private runAnimations(transitions: Transition<State, Action>[], nextState: State, prevState: State, action: Action) {
    return new Promise<void>((resolve) => {
      // If there aren't any transitions to run just quit right away
      if (transitions.length === 0) return resolve();
    
      // Keep track of number of animations to run to resolve completion
      let counter = 0;

      // Remember the running animations for aborting
      this.currentAnims = [];

      function onEnd() {
        counter -= 1;
        if (counter === 0) {
          this.currentAnims = null;
          resolve();
        }
      }

      transitions.forEach(transition => {
        const anim = transition(action, nextState, prevState);
        if (!anim) return;
        if (Array.isArray(anim)) {
          anim.forEach(a => {
            if (!a) return;
            counter += 1;
            this.currentAnims.push(a);
            a.start(onEnd);
          });
        } else {
          counter += 1;
          this.currentAnims.push(anim);
          anim.start(onEnd);
        }
      });

      // It is possible that none of the transitions had any animations to run
      // So, resolve right away
      if (counter === 0) resolve();
    });
  }

  private startDispatch(action: Action, prevState: State) {
    this.running = true;

    this.internalDispatch(action, prevState).then((success) => {
      this.running = false;
      this.aborted = false; // Clear the aborted flag as well

      // Remember the prevState, when performing a batch action
      // We want the prevState to the the one before all the batched
      // actions
      let prevState = this.currentState;

      // Looks like the dispatch was aborted, 
      // This might be the user requested a sync to move
      // forward. In which case process the entire array.
      if (!success) {
        // Process all the actions, except the last one
        while (this.queue.length > 1) {
          this.currentState = this.reducer(this.currentState, this.queue.shift());
        }

        // It might be possible that the backlog was processed
        this.backLogs.forEach(cb => cb());
      }

      // Continue with the remaining actions only
      if (this.queue.length && !this.shouldHoldAction()) {
        this.startDispatch(this.queue.shift(), prevState);
      }
    });
  }

  private async internalDispatch(action: Action, prevState: State) {
    // Generate the next state
    this.currentState = this.reducer(this.currentState, action);
    const nextState = this.currentState;

    // Run all unmount transitions
    await this.runAnimations(this.unmounts, nextState, prevState, action);
    if (this.aborted) return false;

    // Perform a state transition, in case there aren't any transitions, no need
    // to update state with transient condition
    if (this.transitions.length) {
      await this.updateState(nextState, prevState);
      if (this.aborted) return false;

      await this.runAnimations(this.transitions, nextState, prevState, action);
      if (this.aborted) return false;
    }

    // Perform a stable state update
    await this.updateState(nextState, nextState);
    if (this.aborted) return false;

    // Perform mount transition
    await this.runAnimations(this.mounts, nextState, prevState, action);
    if (this.aborted) return false;
    
    return true;
  }

  private async updateState(nextState: State, prevState: State) {
    // Run the state updates from the back, to avoid problems that
    // may arise due to array mutation
    this.reactBatchedUpdates(() => {
      for (let i = this.stateUpdates.length - 1; i >= 0; i -= 1) {
        this.stateUpdates[i](nextState, prevState);
      }
    });
    
    // Wait for the state update to complete, except the state update to
    // complete in an event loop
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  withVisibility<S extends State>(visibilityCheck: MapState<S, boolean>) {
    return <Props = {}>(Component: ComponentType<Props>) => {
      return (props: Props) => {
        const visible = this.useState(visibilityCheck);
        if (!visible) return null;
        return createElement(Component, props);
      }
    }
  }

  useUnmount<S extends State>(transition: Transition<S, Action>, deps: any[] = []) {
    useEffect(() => subscribe(this.unmounts, transition), deps);
  }

  useMount<S extends State>(transition: Transition<S, Action>, deps: any[] = []) {
    useEffect(() => subscribe(this.mounts, transition), deps);
  }

  useTransition<S extends State>(transition: Transition<S, Action>, deps: any[] = []) {
    useEffect(() => subscribe(this.transitions, transition), deps);
  }

  useState<S extends State, Result>(mapState: MapState<S, Result>, deps: any[] = []): Result {
    const [value, setValue] = useState(() => {
      const state = this.currentState as S;
      return mapState(state, state);
    });

    useEffect(() => {
      let prev = value;
      function cb(nextState: S, prevState: S) {
        const next = mapState(nextState, prevState);
        if (next !== prev) {
          prev = next;
          setValue(next);
        }
      }
      return subscribe(this.stateUpdates, cb);
    }, deps);

    return value;
  }

  useBackLog(max: number) {
    const [backlog, setBackLog] = useState(this.queue.length > max);
    useEffect(() => {
      return subscribe(this.backLogs, () => {
        setBackLog(this.queue.length > max);
      });
    }, [max]);

    return backlog;
  }
}
