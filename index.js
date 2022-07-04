const express = require ('express'),
  morgan = require('morgan');
  fs = require('fs'),
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream, accessLogStream}));

let topMovies = [
  {
    Title: "Alien"
  },
  {
    Title: "Lord of the Rings"
  },
  {
    Title: "The Big Labowski"
  },
  {
    Title: "Airheads"
  },
  {
    Title: "Star Wars"
  }

];

app.get('/', (req, res) => {
  res.send('Welcome to "Martini Shot"');
});

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.Json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh No! What happened?!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
