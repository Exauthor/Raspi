const axios = require('axios')
const app = require('express')()
const execSync = require('child_process').execSync;

app.get('/memory', (req, res) => {
  let freePrecent = execSync('free | awk \'/Mem/{printf("%d"), $3/$2*100}\'').toString('utf8'),
      freeMemory = execSync('free | awk \'/Mem/{printf("%d"), $3/1024}\'').toString('utf8');
  
  res.json({'percentMemory': 100 - freePrecent, 'usedMemory': freeMemory})
})

app.get('/cpu-up', (req, res) => {
  execSync('sysbench --test=cpu --num-threads=4 --cpu-max-prime=20000 run');

  res.json({'cpu': 'start'})
})

app.get('/humidity', (req, res) => {
  res.json({'humidity': 0})
})

app.get('/external_temperature', (req, res) => {
  let temperature;
  
  if (!!process.env.API_DATA) {
    temperature = execSync('sudo python2 GPIO/bme280.py | awk \'/Tem/{printf($3)}\'').toString('utf8');
  } else {
    temperature = parseInt(Math.random() * 20 + 10);
  }

  res.json({'temperature': temperature})
})

app.get('/temperature', (req, res) => {
  let temperature;

  if (!!process.env.API_DATA) {
    temperature = execSync('vcgencmd measure_temp').toString('utf8').slice(5,9);
  } else {
    temperature = parseInt(Math.random() * 60 + 20);
  }

  res.json({'temperature': temperature});
})

app.get('/hello', (req, res) => {
  console.log('hello nuxt in text')
  res.send('world')
})


module.exports = { path: '/api', handler: app }
