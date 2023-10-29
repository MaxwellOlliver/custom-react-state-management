import { useSyncExternalStore } from 'react';

type UpdaterFn<TState = unknown> = (prevState: TState) => Partial<TState>;
type Listener = () => void;
type SetStateFn<TState = unknown> = (
  partialState: Partial<TState> | UpdaterFn<TState>,
) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStore<TState extends Record<string, any>>(
  createInitialState: (
    setState: SetStateFn<TState>,
    getState: () => TState,
  ) => TState,
) {
  let state: TState;
  let listeners: Set<Listener>; // Observable pattern

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<TState> | UpdaterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = {
      ...state,
      ...newValue,
    };

    notifyListeners();
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function getState() {
    return state;
  }

  function useStore<TValue>(selector: (currentState: TState) => TValue) {
    return useSyncExternalStore(subscribe, () => selector(state));
  }

  state = createInitialState(setState, getState);
  listeners = new Set();

  return useStore;
}
