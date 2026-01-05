const express = require("express")
const Product = require("../models/product")
const router = express.Router()

router.post("/", async (req,res) => {
      try {
        const product = await Product.create(req.body)
        res.status(201).json({ product })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: "failed to create product" })
    }
})

module.exports = router