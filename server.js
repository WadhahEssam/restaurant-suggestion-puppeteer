const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const env = require('./env');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 6768;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log(req);
  res.send('Hello World');
});

app.post('/getInformation', async (req, res) => {
  // console.log(req.body);
  getData(req.body.lat, req.body.long);
  res.send(`lat : ${req.body.lat} / long : ${req.body.long}`)
})

getData = async (lat, long) => {
  console.log(`lat : ${lat} / long ${long}`);
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({height: 1080, width: 1920});
  await page.goto(`https://wainnakel.com/api/v1/GenerateFS.php?uid=${lat},${long}&get_param=value`);
  let result = await page.evaluate(() => {
    return document.querySelector('body > pre').textContent
  })
  console.log(result);
  // document.querySelector('body > pre').textContent

  // await browser.close();
}

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));