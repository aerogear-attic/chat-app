const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');

process.on('SIGINT', function() {
  process.exit();
});

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
});