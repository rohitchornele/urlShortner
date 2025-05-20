import { URL } from "../models/url.js";
import shortid from "shortid";

export const urlShort = async (req, res) => {
  const longUrl = req.body.longUrl;

  if (!longUrl || longUrl.trim() === "") {
    return res.render("index.ejs", {shortUrl: null, error: "Input can't be blank"});
  } 

  let existing = await URL.findOne({ longUrl });

  if (existing) {
    // If it exists, reuse the short code
    const shortUrl = `http://localhost:3000/${existing.shortCode}`;
    console.log("URL already exist", existing.shortCode)
    return res.render("index.ejs", { shortUrl });
  }
  
    const shortCode = shortid.generate();
    const shortUrl = `http://localhost:3000/${shortCode}`;

    //save to db
    const newUrl = new URL({
      shortCode,
      longUrl,
    });

    await newUrl.save();

    console.log("URL Short successfully", newUrl);
    res.render("index.ejs", { shortUrl, longUrl: null });
};

export const getOriginalUrl = async (req, res) => {
  const shortCode = req.params.shortCode;

  // find shortCode in DB

  const urlRecord = await URL.findOne({ shortCode });

  if (urlRecord) {
    res.redirect(urlRecord.longUrl);
  } else {
    res.status(404).send("URL not found");
  }
};