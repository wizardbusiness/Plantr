const express = require ('express');
const createError = require ('http-errors')
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/'), (req, res) => {
  res.send('Got a post request')
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




