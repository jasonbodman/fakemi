const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { createCanvas } = require('canvas');

const makeMeme = async ({
  //the url of the image to put the text on
  url,
  //the text to put on the image
  input,
}) => {
  //if there's no image to work with
  //don't try anything
  if (!url) return undefined

  const canvas = createCanvas(200, 200);
  const context = canvas.getContext("2d")

  const fontSetting = "bold 50px Impact";
  context.font = fontSetting

  const text = context.measureText(input);
  const textWidth = text.width

  //loadImage is a function from node-canvas that loads an image
  const image = await loadImage(url)

  //set the canvas to the same size as the image
  canvas.width = image.width
  canvas.height = image.height

  //changing the canvas size resets the font
  //so use the fontSetting again
  context.font = fontSetting

  //do some math to figure out where to put the text
  //indent the text in by half of the extra space to center it
  const center = Math.floor((canvas.width - textWidth) / 2) | 5
  //put the text 30 pixels up from the bottom of the canvas
  const bottom = canvas.height - 30

  //put the image into the canvas first
  //x: 0, y: 0 is the upper left corner
  context.drawImage(image, 0, 0)

  //set the color to white
  context.fillStyle = "white"
  //draw the text in white
  //x uses the value we calculated to center the text
  //y is 30 pixels above the bottom of the image
  context.fillText(input, center, bottom)

  //set the color to black
  context.fillStyle = "black"
  //draw the outline in black
  context.strokeText(input, center, bottom)

  //return the buffer
  return canvas.toBuffer()
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/campaigns/:job/:image', (req, res) => {
    const job = req?.params?.job
    const image = req?.params?.image
    
    const url = "http://quacks.web-mm.com/grabs/" + job + "/" + image
    res.set('Content-Type', 'image/png')
    res.send(Buffer.from(url))
  })
  app.get("/meme/:input/:url*", async (req, res) => {
    const { params } = req
    //get the text input string from the request parameters
    const input = params?.input


    //urls have '/' characters in them
    //but '/' is what express uses to divide up route parameters
    //so to match the whole url, we use an asterisk '*'
    //the asterisk matches everything after the first '/'
    //and assigns it to params[0]

    //so params.url will usually be http:
    const baseUrl = params?.url
    //and params[0] will be www.myImageHost.com/image.jpg
    const restOfUrl = params?.[0]

    //put the baseUrl and restOfUrl together
    const url = baseUrl + restOfUrl

    //get the image buffer
    const image = await makeMeme({ url, input })

    //create headers object
    const headers = { "Content-Type": "image/jpg" }

    //set status code and headers
    res.writeHead(200, headers)

    //end by sending image
    res.end(image)
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
