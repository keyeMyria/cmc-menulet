import { types, getParent } from 'mobx-state-tree'
import baseCurrencies from '../data/base-currencies'

export default types.model('Ticker', {
  id: types.identifier(),
  name: types.string,
  symbol: types.string,
  rank: types.string,
  last_updated: types.string,

  available_supply: types.maybe(types.string),
  total_supply: types.maybe(types.string),

  percent_change_1h: types.maybe(types.string),
  percent_change_24h: types.maybe(types.string),
  percent_change_7d: types.maybe(types.string),
  ...baseCurrencies.map(x => x.toLocaleLowerCase()).reduce((props, c) => ({
    ...props,
    [`price_${c}`]: types.maybe(types.string),
    [`24h_volume_${c}`]: types.maybe(types.string),
    [`market_cap_${c}`]: types.maybe(types.string),
  }), {}),
  holdings: types.optional(types.number, 0.0),
}).views(self => ({
  get fuzzy() {
    return [self.name, self.symbol].join(' ')
  },
  get price() {
    return self[`price_${self.baseCurrency.toLocaleLowerCase()}`]
  },
  get baseCurrency() {
    return getParent(self, 2).baseCurrency
  },
})).actions(self => ({
  setHoldings(amount) {
    self.holdings = amount
  },
}))
