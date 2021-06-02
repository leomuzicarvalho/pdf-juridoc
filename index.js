const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const puppeteer = require('puppeteer');

// {
//   origin: function(origin, callback){
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }

app.use(cors());
app.use(express.json());

async function printPDF(content) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(content, {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ format: 'A4', margin: {
        top: "1.5cm",
        right: "1.5cm",
        bottom: "1.5cm",
        left: "1.5cm"
    } });
   
    await browser.close();
    return pdf;
  }

app.put('/pdf', (req, res) => {
    printPDF(req.body.content).then(pdf => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
    });
})

app.post('/', (req, res) => {
  res.send("works");
})

app.get('/', (req, res) => {
  res.send("Juridoc PDF app!");
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})