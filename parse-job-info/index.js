const puppeteer = require("puppeteer");

const parseStackOverflow = require("./parsers/stackoverflow");

const parseJobInfo = (req, res) => {
  if (!req.body || !req.body.url) {
    res.status(400);
    res.send({ error: "Bad Request" });
    return;
  }

  const url = req.body.url;
  let metadata = {};
  puppeteer
    .launch({ args: ["--no-sandbox"] })
    .then(browser => browser.newPage())
    .then(page => page.goto(url).then(_ => page.content()))
    .then(html => {
      if (url.startsWith("https://stackoverflow.com/jobs/")) {
        metadata = parseStackOverflow(html);
      }
      res.status(200);
      res.send(metadata);
    })
    .catch(err => {
      console.error(err);
      res.status(500);
      res.send({ error: "Server Error" });
    });
};

module.exports = { parseJobInfo };
