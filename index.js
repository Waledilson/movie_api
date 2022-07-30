const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const bodyParser = require('body-parser');
const express = require ('express'),
  morgan = require('morgan');
const app = express();

mongoose.connect('mongodb://localhost:27017/martinishot', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use (morgan('common'));

/*let topMovies = [
  {
    Title: "Alien"
  },
  {
    Title: "American Gangster"
  },
  {
    Title: "Gladiator"
  },
  {
    Title: "Star Wars Ep.IV A New Hope"
  },
  {
    Title: "Star Wars Ep V The Empire Strikes Back"
  },
  {
    Title: "Tinker, Tailor, Soldier, Spy"
  },
  {
    Title: "Titanic"
  },
  {
    Title: "Avatar"
  },
  {
    Title: "The Abyss"
  },
  {
    Title: "The Labyrinth"
  }
];
*/
app.get('/', (req, res) => {
  res.send('Welcome to "Martini Shot"');
});

app.use(express.static('public'));

//return all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//return info for specific title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(400).send('Error: ' + err);
  });
});

//return info for specific genre
app.get('/movies/genres/:genreName', (req, res) => {
  Movies.findOne({ 'Movie.Genre.Description': req.params.genreName })
  .then((movie) => {
    res.json(movie.Genre.Description);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//return info on specific director
app.get('/movies/directors/:directorName', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
  .then((movie) => {
    res.json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//post data on new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
    })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//get all users
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//update user data
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//add movie to user's list of favorites (post)
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//remove movie from user's list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//delete user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/*
//user de-registration
app.delete('/users', (req, res) => {
  res.send('a message saying saying the users email has been removed');
});
*/

//error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh No! What happened?!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});

