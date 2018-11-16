var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/User');
var settings = require('../config/settings'); // get settings file

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = settings.tokenSecret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({ id: jwt_payload.id }).populate('userProfile').exec(function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user.userProfile);
            } else {
                done(null, false);
            }
        });
    }));
};