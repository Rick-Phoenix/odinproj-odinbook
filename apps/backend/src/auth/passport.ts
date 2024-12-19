import passport from "passport";
import { isPasswordValid } from "./passwordUtils.js";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByEmail, findUserById } from "prisma/queries.js";
import { User } from "@prisma/client";

passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    email,
    password,
    done
  ) {
    findUserByEmail(email)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "User does not exist." });
        }

        const isValid = isPasswordValid(password, user.hash, user.salt);
        if (!isValid)
          return done(null, false, { message: "Incorrect password." });

        return done(null, user);
      })
      .catch((err: Error) => {
        return done(err);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser((id: number, done) => {
  findUserById(id)
    .then((user) => {
      if (!user) return done(null, false);
      const { id, username } = user;
      const userData = { id, username };
      return done(null, userData);
    })
    .catch((err: Error) => {
      return done(err);
    });
});

export default passport;
