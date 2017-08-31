import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'

import Logo from './logo'
import Input from './input'
import Currency from './currency'
import Sparkline from './sparkline'

const Ticker = observer(({ ticker }) => {
  const { id, name, symbol, holdings, setHoldings, price, baseCurrency, percent_change_24h } = ticker
  return (
    <div className="flex ph3 pv2 bb b--gray-9 lh-copy items-center" key={id}>
      <div className="flex w4 mr2 items-center">
        <i className={classNames('f3 w2 mr2 gray-6', `cc-${symbol}`)} />
        {/* <Logo id={ticker.id} /> */}
        <div className="flex-auto">
          <div className="b gray-3">{symbol}</div>
          <div className="f7 gray-6">{name}</div>
        </div>
      </div>
      <div className="flex flex-auto mr2">
        <Sparkline symbol={symbol} />
      </div>
      <div className="flex flex-column items-end gray-3">
        <div><Currency amount={price} /> {baseCurrency}</div>
        <div className={classNames('f7', { 'green-5': percent_change_24h > 0, 'red-5': percent_change_24h < 0 })}>{percent_change_24h}%</div>
        <div className="gray-7 f7">
          <Input className="tr bn" style={{ paddingRight: 8, marginRight: -22 }} type="number" value={holdings} onChange={(e) => { setHoldings(e.target.valueAsNumber) }} />
        </div>
      </div>
    </div>
  )
})

export default Ticker
