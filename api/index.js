import express, { urlencoded } from "express";
import mongoose from "mongoose";
import { getOriginalUrl, urlShort } from "../controllers/urlController.js";
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { fileURLToPath } from 'url';
import path from "path";


dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT;

app.use(express.urlencoded({extended: true}));
const MONGO_URL = process.env.MONGO_URL;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "URL_SHORTNER_DB",
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
   connectDB();

app.get("/", (req, res) => {
  res.render("index", { shortUrl: null });
});

//handle URL Submission
app.post("/shorten", urlShort);

// handle direct url
app.get("/shorten", (req, res) => {
  res.redirect('/');
});

//redirect to original url using short url\
app.get('/:shortCode', getOriginalUrl)

export default serverless(app);

// app.listen(port, () => console.log(`Server is running on port ${port}`));