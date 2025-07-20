require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return res.status(403).send({ error: "Blocked: No Origin header" });
  }

  if (origin !== process.env.ALLOW_HOST) {
    return res.status(403).send({ error: `Blocked: ${origin} not allowed` });
  }

  cors({
    origin: process.env.ALLOW_HOST,
    optionsSuccessStatus: 200,
  })(req, res, next);
});

app.get("/status", (req, res) => {
  res.status(200).send("ok");
});

app.get("/", (req, res) => {
  const { clientId = "" } = req.query ?? {};

  if (!clientId) {
    console.error("clientId is empty");
    return res.status(400).send({ message: "clientId is required" });
  }

  const payload = {
    c: "hello",
    referer: "",
    Pc: "BGC0CKjnkObxPeqkTxZ3jHFgA+y1GZQMw1Uh7CWFNyZnhAKIi8p17bZPsWpFCEga2ci26Y42qOhqkgHnuI6nZfs=",
    clientId,
  };

  fetch(`https://send.monobank.ua/api/handler`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(new Date() + ": " + data.jarAmount);

      res.send(data);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
