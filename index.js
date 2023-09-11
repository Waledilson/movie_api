require("dotenv").config();
const mongoose = require("mongoose"),
  Models = require("./models.js"),
  Movies = Models.Movie,
  Users = Models.User,
  bodyParser = require("body-parser"),
  express = require("express"),
  app = express(),
  morgan = require("morgan"),
  bcrypt = require("bcrypt"),
  { check, validationResult } = require("express-validator");

// mongoose.connect("mongodb://localhost:27017/martinishot", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect("mongodb://localhost:8080", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));

//list of allowed-origins
const cors = require("cors");
app.use(cors({ origin: true }));
let allowedOrigins = [
  "http://localhost:8080",
  "https://intense-shore-03094.herokuapp.com/",
  "http://localhost:1234",
  "https://movieapi-production-1d07.up.railway.app",
  "http://localhost:4200",
  "https://waledilson.github.io/myFlix-Angular-client",
  "https://waledilson.github.io/",
  "https://waledilson.github.io/myFlix-Angular-client/",
  "https://waledilson.github.io/movie_api-client/",
  "https://martini-shot-react.netlify.app/",
  "https://martini-shot-react.netlify.app",
  "https://64efe4fc59547b0cfa3c6301--martini-shot-react.netlify.app/",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

require("./auth")(app);
const passport = require("passport");
require("./passport");

//welcome
app.get("/", (req, res) => {
  res.send('Welcome to "Martini Shot"');
});

app.use(express.static("public"));

/**
 * @service GET all movies in database
 * @returns all movie info arrays in json
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @service GET single movie
 * @param title
 * @returns single movie info in json
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send("Error: " + err);
      });
  }
);

/**
 * @service GET genre info
 * @param genreName
 * @returns name and description of genre in json
 */
app.get(
  "/movies/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @service GET director info
 * @param directorName
 * @returns name, birth year and bio of director in json
 */
app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @service POST to the endpoint to register new user
 * @returns a new user object in json
 * @param Username
 */
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * @service GET all users
 * @returns all users registered
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @service PUT newly updated info of logged-in user
 * @param updatedUser
 * @returns updated user information
 */
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @service POST specific movie to user's list of favorite movies
 * @param MovieId
 * @returns updated array of user's favorite movies in json
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @service DELETE specific movie from user's list of favorite movies
 * @param MovieId
 * @returns updated array of user's favorite movies in json
 */
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @service GET user info
 * @returns name, password, email and date of birth of requested user in json
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @service DELETE user from database
 * @returns nothing
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oh No! What happened?!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
