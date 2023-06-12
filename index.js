const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8081;
app.use(cors({
  origin: '*'
}));

app.get('/', async (req, res) => {
  try {
    const result = await axios.get(
      `https://api.github.com/repos/tony-lima/mock-server/contents/db.json`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          "Access-Control-Allow-Origin": "*"
        },
      }
    );
    const db = JSON.parse(
      Buffer.from(result.data.content, 'base64').toString()
    );

    res.send(db);
  } catch (error) {
    res.status(400).send(`Error while getting list of repositories. ${error}}`);
  }
});

app.get(`/:path`, async (req, res) => {
  try {
    const result = await axios.get(
      `https://api.github.com/repos/tony-lima/mock-server/contents/db.json`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          "Access-Control-Allow-Origin": "*"
        },
      }
    );
    const db = JSON.parse(
      Buffer.from(result.data.content, 'base64').toString()
    );
    const start = parseInt(req.query._start) || 0;
    const limit = parseInt(req.query._limit) || db[req.params.path].length;
    const data = db[req.params.path].slice(start, start + limit) || [];


    res.send(data);
  } catch (error) {
    res.status(400).send(`Error while getting ${req.params.path}. ${error}}`);
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
