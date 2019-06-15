const cloudscraper = require("cloudscraper");
const request = require("request");

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
      request(url, (err, _, body) => {
        if (err) {
          console.error(err);
          res.status(500);
          res.send({ error: "Server Error" });
          return;
        }

        if (body) {
          metadata = parseStackOverflow(body);
        }

        res.status(200);
        res.send(metadata);
      });
    } else {
      // Default
      res.status(200);
      res.send(metadata);
    }
  }
};

module.exports = { parseJobInfo };
