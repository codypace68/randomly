const express = require('express');
const path = require('path');
const app = express();

app.use('/randomly', express.static(path.join(__dirname, 'build')));

app.get('/randomly/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000, () => console.log('Listening on port 3000!'));