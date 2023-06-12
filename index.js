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
    if (req.params.path === 'reviews') {
      const start = parseInt(req.query.start) || 0;
      const limit = parseInt(req.query.limit) || db[req.params.path].apps[0].review.length;
      const data = db[req.params.path].apps[0].review.slice(start, start + limit) || [];
      const formatted = {
        "apps": [
          {
            "name": "com.claro.residencial",
            "review": data
          },
        ],
      }
      return res.send(formatted);
    }
    const data = db[req.params.path];
    if (data) {
      res.send(data);
    } else {
      res.status(404).send(`No data found for ${req.params.path}`);
    }
  } catch (error) {
    res.status(400).send(`Error while getting ${req.params.path}. ${error}}`);
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
