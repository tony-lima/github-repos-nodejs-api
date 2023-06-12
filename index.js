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
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || db[req.params.path].length;
    console.log("path is: ", req.params.path);
    if (req.params.path === 'reviews') {
      const data = db[req.params.path].app[0].review.slice(start, start + limit) || [];
      console.log("data if is: ", data);
      const formatted = {
        "app": [
          {
            "name": "com.claro.residencial",
            "review": data
          },
        ],
      }
      return res.send(formatted);
    }
    const data = db[req.params.path];
    console.log("data: ", data);
    res.send(data);
  } catch (error) {
    res.status(400).send(`Error while getting ${req.params.path}. ${error}}`);
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
