const express = require ('express'),
  morgan = require('morgan');

const app = express();

app.use (morgan('common'));
let topMovies = [
  {
    Title: "Alien"
  },
  {
    Title: "The Lord of the Rings"
  },
  {
    Title: "The Big Labowski"
  },
  {
    Title: "Star Wars"
  },
  {
    Title: "The Matrix"
  },
  {
    Title: "Tinker, Tailor, Soldier, Spy"
  },
  {
    Title: "Airheads"
  },
  {
    Title: "Forest Gump"
  },
  {
    Title: "Titanic"
  },
  {
    Title: "UHF"
  }
];

app.get('/', (req, res) => {
  res.send('Welcome to "Martini Shot"');
});

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh No! What happened?!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
