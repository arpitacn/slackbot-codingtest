const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/",(req,res)=>{
    res.send("Hello world");
})

module.exports = router;