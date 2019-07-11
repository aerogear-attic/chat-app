import express from "express";
import cors from 'cors'
import { chats } from "./db";

const app = express();

//middleware - cors to allow cross origin requests(not local host only)
app.use(cors())

app.get("/chats", (req, res) => {
  res.json(chats);
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
