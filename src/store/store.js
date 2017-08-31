import numeral from 'numeral'
import { sum } from 'lodash'
import { types } from 'mobx-state-tree'
import { filter } from 'fuzzaldrin'
import { autorun } from 'mobx'
import { ipcRenderer } from 'electron'

import Ticker from './ticker'

// https://min-api.cryptocompare.com/data/histohour?aggregate=1&e=CCCAGG&extraParams=cmcio&fsym=ETH&limit=168&tryConversion=true&tsym=BTC
// https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=ETH&tsym=BTC
// http://coinmarketcap.io/apiUpdateCoinDb.php?callback=jQuery321010028499331151552_1504190298069&updatecoindb=yes&_=1504190298070
// http://coinmarketcap.io/system_coin_db_v2.js

export default types.model('Store', {
  query: types.optional(types.string, ''),
  baseCurrency: types.optional(types.string, 'USD'),
  tickers: types.optional(types.map(Ticker), {}),
  // tickerLimit: types.optional(types.number, 25),
  showOnlyHolding: types.optional(types.boolean, false),
})
  .views(self => ({
    get matchingHoldingsTickers() {
      if (self.showOnlyHolding) {
        return self.tickers.values().filter(({ holdings }) => holdings > 0)
      }
      return self.tickers.values()
    },
    get matchingTickers() {
      return filter(self.matchingHoldingsTickers, self.query, { key: 'fuzzy' })
    },
    get portfoioValue() {
      return sum(self.tickers.values().map(c => c.holdings * c.price))
    },
  }))
  .actions(self => ({
    afterCreate() {
      setInterval(self.fetchTickers, 30000)
      autorun(() => {
        self.fetchTickers()
      })

      autorun(() => {
        ipcRenderer.send('set-title', `${numeral(self.portfoioValue).format('0,0.00')} ${self.baseCurrency}`)
      })
    },
    async fetchTickers() {
      const url = new URL('https://api.coinmarketcap.com/v1/ticker/')
      url.searchParams.append('convert', self.baseCurrency)
      // url.searchParams.append('limit', self.tickerLimit)
      url.searchParams.append('fresh', Date.now())
      const response = await fetch(url)
      self.setTickers(await response.json())
    },
    toggleOnlyHolding() {
      self.showOnlyHolding = !self.showOnlyHolding
    },
    setTickers(tickers) {
      tickers.map(self.upsertTicker).forEach((ticker) => { self.tickers.put(ticker) })
    },
    setBaseCurrency(value) {
      self.baseCurrency = value
    },
    upsertTicker({ id, ...props }) {
      const ticker = self.tickers.get(id)
      if (ticker) {
        return { ...ticker, ...props }
      }
      return { id, ...props }
    },
    setQuery(e) {
      self.query = e.target.value
    },
    setHoldings(ticker, amount) {
      self.holdings.set(ticker.id, { amount })
    },
  }))
