const path = require('path')
const electron = require('electron')
const defaultMenu = require('electron-default-menu')

const { app, shell, BrowserWindow, Menu } = electron

let win

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')
  const config = require(path.resolve('./webpack.config.js'))

  config.output.publicPath = 'http://localhost:8080/'
  config.entry.unshift('react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server')
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin())

  const compiler = webpack(config)
  const server = new WebpackDevServer(compiler, { hot: true, inline: true })
  server.listen(8080)
}

app.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(defaultMenu(app, shell)))

  const { screen } = electron
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({ width, height })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8080/renderer.html')
  } else {
    win.loadURL(`file://${__dirname}/dist/renderer.html`)
  }

  if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null
  })
})
