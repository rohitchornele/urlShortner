// import express, { urlencoded } from "express";
// import mongoose from "mongoose";
// import { getOriginalUrl, urlShort } from "../controllers/urlController.js";
// import dotenv from 'dotenv';
// import serverless from 'serverless-http';
// import { fileURLToPath } from 'url';
// import path from "path";


// dotenv.config();

// const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// const port = process.env.PORT;

// app.use(express.urlencoded({extended: true}));
// const MONGO_URL = process.env.MONGO_URL;

// let isConnected = false;

// async function connectDB() {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       dbName: "URL_SHORTNER_DB",
//     });
//     isConnected = true;
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error);
//   }
// }
//    connectDB();

// app.get("/", (req, res) => {
//   res.render("index", { shortUrl: null });
// });

// //handle URL Submission
// app.post("/shorten", urlShort);

// // handle direct url
// app.get("/shorten", (req, res) => {
//   res.redirect('/');
// });

// //redirect to original url using short url\
// app.get('/:shortCode', getOriginalUrl)

// const handler = serverless(app);
// export default handler;
// // app.listen(port, () => console.log(`Server is running on port ${port}`));











import express, { urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { fileURLToPath } from "url";
import path from "path";

// Controllers
import { getOriginalUrl, urlShort } from "../controllers/urlController.js";

dotenv.config();

const app = express();

// View engine setup (optional if using EJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(urlencoded({ extended: false }));

// MongoDB connection
let isConnected = false;
async function connectToMongo() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
}

// Routes
app.get("/:shortId", async (req, res) => {
  await connectToMongo();
  getOriginalUrl(req, res);
});

app.post("/shorten", async (req, res) => {
  await connectToMongo();
  urlShort(req, res);
});

// Must export this
export const handler = serverless(app);
