const express = require('express');
const http = require('http');
const app = express();
const static = express.static(__dirname + '/static');

app.use(static);

app.get('/chunk', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  
  let counter = 0;
  const MAX = 300;

  let id = setInterval(() => {
    counter += 1;
    if (counter > MAX) {
      clearInterval(id);
      res.end();
    } else {
      const data = `CHUNK ${counter};`;
      res.write(data);
    }
  }, 30);
});

http.createServer(app).listen(9090);
