const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/campaigns/:job/:image', (req, res) => {
    const job = req?.params?.job
    const image = req?.params?.image
    
    const url = "http://quacks.web-mm.com/grabs/" + job + "/" + image
    res.send("URL: " + url)
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
