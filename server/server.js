const express = require ('express');
const createError = require ('http-errors')
const app = express();
const path = require('path');
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../public/index.html'))
});

app.post('/'), (req, res) => {
  res.status(200).send({body: req.body.plant})
}


app.put('/'), (req, res) => {
  res.send('Received put request at /')
}

app.delete('/'), (req, res) => {
 res.send('Received a delete request at /')
}

 app.use((req, res) => {
  res.status(404).send('No sprouts in this bed.')
});

app.listen(port, () => {
  console.log(`Planter listening on port ${port}`);
});




