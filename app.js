const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(3000, () => {
  console.log('server is running on 3000');
});
