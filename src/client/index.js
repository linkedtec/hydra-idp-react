import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

import configureStore from 'src/common/store'

const initialState = window.INITIAL_STATE
const store = configureStore(initialState)

const container = document.getElementById('app')

let render = () => {
  const routes = require('src/common/routes').default

  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}
              routes={routes} />
    </Provider>,
    container
  )
}

if (module.hot) {
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={error} />,
      container
    )
  }

  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }

  module.hot.accept('src/common/routes', () => {
    ReactDOM.unmountComponentAtNode(container)
    setTimeout(render)
  })
}

render()
