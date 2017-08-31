import React from 'react'
import classNames from 'classnames'
import { observer, inject } from 'mobx-react'

import Input from './input'
import Ticker from './ticker'
import Currency from './currency'
import VirtualList from './virtual-list'
import baseCurrencies from '../data/base-currencies'

@inject('store')
@observer
export default class App extends React.PureComponent {
  renderItem(ticker) {
    return (
      <Ticker
        key={ticker.id}
        ticker={ticker}
      />
    )
  }

  render() {
    const { store } = this.props
    return (
      <div className="sans-serif gray-5 bg-gray-8 vh-100 flex overflow-hidden flex flex-column">
        <div className="flex flex-none ph3 pv2 bb b--gray-9 f3 items-center justify-center">
          <span className="mr1"><Currency amount={store.portfoioValue} /></span>
          <span className="f5">
            <select
              className="input-reset outline-0 color-inherit bn bg-transparent"
              defaultValue={store.baseCurrency}
              onChange={e => store.setBaseCurrency(e.target.value)}
            >
              {baseCurrencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </span>
        </div>
        <div className="flex flex-none ph3 pv2 bb b--gray-9">
          <Input className="bn" type="search" placeholder="Search..." value={store.query} onChange={store.setQuery} />
          <div
            className={classNames('pointer ba ph2 pv1 br2 b--gray-7', { 'bg-gray-7': store.showOnlyHolding, 'bg-transparent': !store.showOnlyHolding })}
            onClick={store.toggleOnlyHolding}
          >HOLD</div>
        </div>
        <VirtualList items={store.matchingTickers} itemHeight={74} renderItem={this.renderItem} />
      </div>
    )
  }
}
