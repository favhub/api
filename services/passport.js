const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const strategy = () => {
  let opts = {jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_ENCRYPTION};

  return new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.userId}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
};

module.exports = {strategy};
