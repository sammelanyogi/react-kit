# Transition Library

## Transition Lifecyle

1. Dispatch (action) nextState = prevState + action
2. **useUnmount** hooks (nextState, prevState, action)
3. Transient **useState** hooks (nextState, prevState)
4. **useTransition** hooks (nextState, prevState, action);
5. Stable **useState** hooks (nextState, nextState) -- both states are same in this case
6. **useMount** hooks (nextState, prevState, action)
7. Repeat from step 1

Notes:
* Any action dispatched within the transition lifecyle are queued for sequential execution.
* The Transient *useState* hook is executed only when any **useTransition** hooks are defined.
* The Transition library provides **catchup** function to abort any current transition
  and the backlogs and directly executes the final action. During such update, the prevState
  would be the one before all the queued actions were dispatched and nextState would
  be the fresh state after the last action is dispatched.


## Usage

```typescript
import { TransitionController } from '@bhoos/transition';

const GameTransition = new TransitionController(reducer);

function PlayerCards() {
  const cards = GameTransition.useState(getUserCards);
  
  GameTransition.useMount((nextState, prevState, action) => {
    if (nextState.turn === nextState.userIdx) {
      // Activate cards
    }
  });

  GameTransition.useUnmount((nextState, prevState, action) => {
    if (action instanceof ThrowCard && prevState.turn === prevState.userIdx) {
      return throwAnimation(action.card);  
    }
  });
}


// Using the transient states
function RouterPortal() {
  const screens = RouteTransition.useState((next, prev) => {
    if (next === prev) return [next];
    return [prev, next];
  });
  
  RouteTransition.useTransition(next prev) => {
    // Hide prev and show next
  });

  screens.map(scr => {
    // render scr
  });
}

```

