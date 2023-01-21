const express = require('express');
const path = require('path');
const plantRoutes = require('./routes/plantRoutes.js');

const port = 3000;
const app = express();

// parse static files
app.use(express.json());
app.use(express.static('./src'));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../src/index.html'));
});

app.use('/', plantRoutes);

app.use((req, res) => {
  res.status(404).send('No sprouts in this bed.')
});

app.use('/', (err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400, 
    message: {err: 'An error occured'},
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log(`Plantr listening on port ${port}`);
});




