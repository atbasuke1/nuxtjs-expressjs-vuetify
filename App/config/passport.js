const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const config = require("../config/auth");
const User = require("../Models/User.model");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.JWT_SECRET,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        const user = await User.findById(payload.sub);

        if (!user) {
          return done(null, false);
        }
        req.user = user;
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: config.facebookAuth.clientID,
      clientSecret: config.oauth.facebookAuth.clientSecret,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);

        if (req.user) {
          req.user.methods.push("facebook");
          req.user.facebook = {
            id: profile.id,
            email: profile.emails[0].value,
          };
          await req.user.save();
          return done(null, req.user);
        } else {
          let existingUser = await User.findOne({ "facebook.id": profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          existingUser = await User.findOne({
            "local.email": profile.emails[0].value,
          });
          if (existingUser) {
            existingUser.methods.push("facebook");
            existingUser.facebook = {
              id: profile.id,
              email: profile.emails[0].value,
            };
            await existingUser.save();
            return done(null, existingUser);
          }

          const newUser = new User({
            methods: ["facebook"],
            facebook: {
              id: profile.id,
              email: profile.emails[0].value,
            },
          });

          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ "local.email": email });

        if (!user) {
          return done(null, false);
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
