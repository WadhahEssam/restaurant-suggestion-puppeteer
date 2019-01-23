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
  try {
    let data = await getData(req.body.lat, req.body.long);
    res.send(data);
  } catch(err) {
    console.log(err.message);
    res.send('Somthing Wrong Happened');
  }
})

getData = async (lat, long) => {
  console.log(`lat : ${lat} / long ${long}`);
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({height: 1080, width: 1920});
  await page.goto(`https://wainnakel.com/api/v1/GenerateFS.php?uid=${lat},${long}&get_param=value`);
  let result = await page.evaluate(() => {
    return document.querySelector('body > pre').textContent
  })
  console.log(JSON.parse(result));
  await browser.close();
  return result;
}

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));