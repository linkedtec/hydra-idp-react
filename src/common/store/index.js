import { identity } from 'ramda'
import { applyMiddleware, compose, createStore } from 'redux'

import { isProduction } from 'src/common/pkg/env'
import rootReducer from 'src/common/reducers'

const middlewares = []

export default (initialState) => {
  const loadDevTools = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      loadDevTools ? window.devToolsExtension() : identity
    )
  )

  if (!isProduction()) {
    if (module.hot) {
      module.hot.accept('src/common/reducers', () => {
        const nextRootReducer = require('src/common/reducers')
        store.replaceReducer(nextRootReducer)
      })
    }
  }

  return store
}
