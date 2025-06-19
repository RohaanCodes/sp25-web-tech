// routes/landingPage.js

const express = require("express");
const router = express.Router();

// GET landing page
router.get("/", (req, res) => {
  res.render("pages/landingPage"); // Make sure the filename is views/landingPage.ejs
});

module.exports = router;
