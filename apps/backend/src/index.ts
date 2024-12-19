import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { errorHandlingMW, getName } from "./controllers/controllers.js";
import passport from "./auth/passport.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);

app.use(
  session({
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 30 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    cookie: {
      maxAge: 5 * 60 * 60 * 1000,
    },
    secret: process.env.COOKIE_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());

app.get("/", getName);

app.use(errorHandlingMW);

app.listen(3000);
