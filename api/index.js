import express, { urlencoded } from "express";
import mongoose from "mongoose";
import { getOriginalUrl, urlShort } from "../controllers/urlController.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
const MONGO_URL = process.env.MONGO_URL;

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "URL_SHORTNER_DB",
    });
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.get("/", (req, res) => {
  res.render("index.ejs", { shortUrl: null });
});

//handle URL Submission
app.post("/shorten", urlShort);

// handle direct url
app.get("/shorten", (req, res) => {
  res.redirect("/");
});

//redirect to original url using short url\
app.get("/:shortCode", getOriginalUrl);

// app.listen(port, () => console.log(`Server is running on port ${port}`));

export default serverless(app);
