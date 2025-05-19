import express, { urlencoded } from "express";
import mongoose from "mongoose";
import { getOriginalUrl, urlShort } from "./controllers/urlController.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({extended: true}));
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, {
    dbName: "URL_SHORTNER_DB",
  })
  .then(() => console.log("Mongodb Connected"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.render("index.ejs", { shortUrl: null });
});

//handle URL Submission
app.post("/shorten", urlShort);

// handle direct url
app.get("/shorten", (req, res) => {
  res.redirect('/');
});


//redirect to original url using short url\
app.get('/:shortCode', getOriginalUrl)

app.listen(port, () => console.log(`Server is running on port ${port}`));
