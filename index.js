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

//return all movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//return info for specific title
app.get('/movies/:title', (req, res) => {
  res.send('successful GET response returning data of specific movie by title');
});

//return info for specific genre
app.get('/movies/:title/:genre', (res, res) => {
  res.send('successful GET response returning data about specific titles genre');
});

//return info on specific director
app.get('/movies/:director', (req, res) => {
  res.send('successful GET response returning data about a director');
});

//post data on new user
app.post('/users/', (res, res) => {
  res.send('a JSON holding data of the user that was added including username, password, email, date of birth');
});

//update user data
app.put('/users/:username', (req, res) => {
  res.send('a message saying their username has been updated');
});

//add movie to user's list of favorites
app.put('/users/:favorites', (req, res) => {
  res.send('a message saying a movie has been added top their list of favorites');
});

//remove movie from user's list of favorites
app.delete('/users/:favorites', (req, res) => {
  res.send('a message saying a movie has been removed from their list of favorites');
});

//user de-registration
app.delete('/users', (req, res) => {
  res.send('a message saying saying the users email has been removed');
});

//error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh No! What happened?!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});

