import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(3000);
