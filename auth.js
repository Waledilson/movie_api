const jwtSecret = "your_jwt_secret";
const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport");

/**
 * Creates JWT
 * @param user object
 * @returns user object and jwt token
 * @function generateJWTToken
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d", //length of time in days (d) before token expires and must be renewed
    algorithm: "HS256",
  });
};
/**
 * @service POST user login, generating a JWT upon login
 * @name postLogin
 * @returns user object with JWT token
 * @requires passport
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
