import React from 'react'
import { scaleLinear } from 'd3-scale'

export default class Logo extends React.PureComponent {
  static defaultProps = { size: 32 }

  componentDidMount() {
    const { id, size } = this.props
    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.onload = this.draw
    image.src = `https://files.coinmarketcap.com/static/img/coins/${size}x${size}/${id}.png`
  }

  render() {
    const { size, className, style } = this.props
    return (
      <div>
        <canvas ref="canvas" {...{ className, style }} width={size} height={size} />
      </div>
    )
  }

  draw(e) {
    const context = this.refs.canvas.getContext('2d')
    context.drawImage(e.target, 0, 0)
    const imageData = context.getImageData(0, 0, e.target.naturalWidth, e.target.naturalHeight)
    const data = imageData.data
    this.setState({ data })

    const levels = []
    for (let i = 0; i < data.length; i += 4) {
      levels.push((data[i] + data[i + 1] + data[i + 2]) / 3)
    }

    const min = Math.min(...levels)
    const max = Math.max(...levels)
    const scale = scaleLinear().domain([min, max]).range([0, 255])

    for (let i = 0; i < data.length; i += 4) {
      const level = scale((data[i] + data[i + 1] + data[i + 2]) / 3)

      if (data[i + 3] > 0) {
        data[i] = level
        data[i + 1] = level
        data[i + 2] = level
      }
    }
    context.putImageData(imageData, 0, 0)
  }
}
