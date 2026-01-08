const express = require('express')
const Product = require('../models/product')
const verifyToken = require('../middleware/verify-token')
const router = express.Router()

//Create
router.post('/', verifyToken, async (req, res) => {
  try {
    req.body.user = req.user._id
    const product = await Product.create(req.body)
    res.status(201).json({ product })
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'failed to create product' })
  }
})
//Read
router.get('/', async (req, res) => {
  try {
    const query = req.query.name ? req.query.name : ''
    console.log('query', query)
    const products = await Product.find({
      name: { $regex: query, $options: 'i' }
    })
    console.log(products)

    res.status(200).json({ products })
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Failed to get products' })
  }
})


router.get("/my-products",verifyToken, async (req, res) => {
    try {
        const products = await Product.find({user:req.user._id})
        res.status(200).json({ products })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: "Failed to get products" })
    }
})

//get one product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
      res.status(404).json({ err: 'product not found' })
    } else {
      res.status(200).json({ product })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Failed to get product' })
  }
})
//delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
      res.status(404).json({ err: 'Product not found' })
    } else {
      res.status(200).json({ product })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Failed to delete' })
  }
})
//update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
    } else {
      res.status(200).json({ product })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to update' })
  }
})
module.exports = router
