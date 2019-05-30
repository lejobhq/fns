const cloudscraper = require("cloudscraper");
const puppeteer = require("puppeteer");

const parseStackOverflow = require("./parsers/stackoverflow");
const parseAngelList = require("./parsers/angel");

const parseJobInfo = (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "https://lejobhq.appspot.com/");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204);
    res.send({});
    return;
  }

  if (!req.body || !req.body.url || req.method !== "POST") {
    res.status(400);
    res.send({ error: "Bad Request" });
    return;
  }

  const url = req.body.url;
  let metadata = {};
  if (url.startsWith("https://angel.co/")) {
    cloudscraper
      .get(url)
      .then(html => {
        metadata = parseAngelList(html);

        res.status(200);
        res.send(metadata);
      })
      .catch(err => {
        console.error(err);
        res.status(500);
        res.send({ error: "Server Error" });
      });
  } else {
    if (url.startsWith("https://stackoverflow.com/jobs/")) {
      puppeteer
        .launch({ args: ["--no-sandbox"] })
        .then(browser => browser.newPage())
        .then(page => page.goto(url).then(_ => page.content()))
        .then(html => {
          metadata = parseStackOverflow(html);

          res.status(200);
          res.send(metadata);
        })
        .catch(err => {
          console.error(err);
          res.status(500);
          res.send({ error: "Server Error" });
        });
    }
  }
};

module.exports = { parseJobInfo };
