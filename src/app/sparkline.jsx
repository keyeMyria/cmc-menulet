import React from 'react'
import Color from 'color'
import { blue } from 'open-color'
import { scaleLinear } from 'd3-scale'
import currencies from '../data/currencies'

export default class Sparkline extends React.PureComponent {
  static defaultProps = {
    color: blue[5],
  }

  state = {
    width: 0, height: 0,
  }

  componentDidMount() {
    if (currencies[this.props.symbol]) {
      const { chartNr } = currencies[this.props.symbol]
      const image = new Image()
      image.crossOrigin = 'Anonymous'
      image.onload = this.draw
      image.src = `https://files.coinmarketcap.com/generated/sparklines/${chartNr}.png`
    }
  }

  render() {
    const { className, style } = this.props
    const { width, height } = this.state
    return (<div>
      <canvas ref="canvas" {...{ className, style, width, height }} />
    </div>)
  }

  draw(e) {
    this.setState({ width: e.target.naturalWidth, height: e.target.naturalHeight })
    const context = this.refs.canvas.getContext('2d')
    context.drawImage(e.target, 0, 0)
    const imageData = context.getImageData(0, 0, e.target.naturalWidth, e.target.naturalHeight)
    const data = imageData.data
    const color = Color(this.props.color)

    const levels = []
    for (let i = 0; i < data.length; i += 4) {
      levels.push((data[i] + data[i + 1] + data[i + 2]) / 3)
    }

    const min = Math.min(...levels)
    const max = Math.max(...levels)
    const scale = scaleLinear().domain([min, max]).range([0, 255])

    for (let i = 0; i < data.length; i += 4) {
      const level = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = color.red()
      data[i + 1] = color.green()
      data[i + 2] = color.blue()
      data[i + 3] = 255 - scale(level)
    }
    context.putImageData(imageData, 0, 0)
  }
}
