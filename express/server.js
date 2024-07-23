// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})
server.use(jsonServer.bodyParser)
server.use(router)
server.listen(3000, () => {
  console.log('JSON сервер запущен...')
})
