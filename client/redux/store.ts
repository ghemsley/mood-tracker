import { useMemo } from 'react'
import { createStore, applyMiddleware, AnyAction, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, { ThunkDispatch } from 'redux-thunk'
import reducers from './reducers'

export type ThunkAppState = ReturnType<typeof reducers>
export type ThunkAppDispatch = ThunkDispatch<ThunkAppState, void, AnyAction>
export type ThunkAppStore = Store<ThunkAppState, AnyAction> & { dispatch: ThunkAppDispatch }
export type ThunkGetState = () => ThunkAppState

let store: any
export function initStore(initialState: any) {
  return createStore(reducers, initialState, composeWithDevTools(applyMiddleware(thunk)))
}

export const initializeStore = (preloadedState: any) => {
  let newstore = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    newstore = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return newstore
  // Create the store once in the client
  if (!store) store = newstore

  return newstore
}

export function useStore(initialState: any) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
