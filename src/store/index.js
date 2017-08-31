import { onSnapshot, getSnapshot, applySnapshot } from 'mobx-state-tree'

import Store from './store'

const store = Store.create(JSON.parse(localStorage.store || '{}'))

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
}

export default store
