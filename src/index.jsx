import React from 'react'
import ReactDOM from 'react-dom'
import { useStrict } from 'mobx'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import { onSnapshot, getSnapshot, applySnapshot } from 'mobx-state-tree'

import App from './app'
import Store from './store'

const store = Store.create(JSON.parse(localStorage.store || '{}'))

useStrict(true)

function render() {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>
    , document.querySelector('#root'),
  )
}

onSnapshot(store, (snapshot) => {
  localStorage.store = JSON.stringify(snapshot)
})

if (module.hot) {
  if (module.hot.data && module.hot.data.store) {
    applySnapshot(store, module.hot.data.store)
  }
  module.hot.dispose((data) => {
    data.store = getSnapshot(store)
  })
  module.hot.accept('./app', render)
}

render()
