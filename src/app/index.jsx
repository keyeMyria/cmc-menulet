import React from 'react'
import { observer, inject } from 'mobx-react'

@inject('store')
@observer
export default class App extends React.PureComponent {
  render() {
    return (
      <div>Hello World</div>
    )
  }
}
