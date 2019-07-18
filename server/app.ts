// seperating app into modules
import bodyParser from "body-parser";
import cors from "cors";
// cookie parser reads cookie header and will parse it into a JSON and define it on req.cookies
import cookieParser from "cookie-parser";
import express from "express";
import { origin } from "./env";

export const app = express();

// enabling server to receive and set cookies.
app.use(cors({ credentials: true, origin }));
app.use(bodyParser.json());

// cookie parser reads cookie header and will parse it into a JSON and define it on req.cookies
app.use(cookieParser());

app.get("/_ping", (req, res) => {
  res.send("pong");
});
