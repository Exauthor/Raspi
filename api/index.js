const axios = require('axios')
const app = require('express')()

app.get('/temperature', (req, res) => {
  let temp = parseInt(Math.random() * 60 + 20);

  res.json({'temperature': temp})
})

app.get('/hello', (req, res) => {
  console.log('hello nuxt in text')
  res.send('world')
})


module.exports = { path: '/api', handler: app }
