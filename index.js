require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  if (req.host !== process.env.ALLOW_HOST) {
    console.error("access denied", req.host);
    return res.status(403);
  }

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
