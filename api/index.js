const axios = require('axios')
const app = require('express')()
const execSync = require('child_process').execSync;

app.get('/memory', (req, res) => {
  let freePrecent = execSync('free | awk \'/Mem/{printf("%d"), $3/$2*100}\'').toString('utf8'),
      freeMemory = execSync('free | awk \'/Mem/{printf("%d"), $3/1024}\'').toString('utf8');
  
  res.json({'percentMemory': freePrecent, 'usedMemory': freeMemory})
})

app.get('/humidity', (req, res) => {
  res.json({'humidity': 0})
})

app.get('/external_temperature', (req, res) => {
  let temperature = execSync('free | awk \'/Mem/{printf("%d"), $3/$2*100}\'').toString('utf8');
  
  res.json({'temperature': temp, 'usedMemory': freeMemory})
})

app.get('/temperature', (req, res) => {
  if (!!process.env.API_DATA) {
    let code = execSync('vcgencmd measure_temp'),
        temp = code.toString('utf8').slice(5,9);
 
    res.json({'temperature': temp})
  } else {
    let temp = parseInt(Math.random() * 60 + 20);

    res.json({'temperature': temp})
  }
})

app.get('/hello', (req, res) => {
  console.log('hello nuxt in text')
  res.send('world')
})


module.exports = { path: '/api', handler: app }
