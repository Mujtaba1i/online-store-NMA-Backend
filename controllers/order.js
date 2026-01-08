const Order = require('../models/order')
const User = require('../models/user')
const express = require('express')
const router = express.Router()

router.get('/', async (req,res) =>{
    try {
        const allUserOrders = await Order.find()
        res.status(200).json(allUserOrders)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'}) 
    }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('products.product')
    res.status(200).json(orders)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ err: 'Failed to fetch orders' })
  }
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const oneOrder = await Order.findById(id)
        if (!oneOrder) {
            res.status(404).json({err: 'order Not Found'})
        } else {
            res.status(200).json({oneOrder})
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'})        
    }
})

router.post('/checkout/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('cart.product')
    if (!user || !user.cart.length) return res.status(400).json('Cart is empty')

    const products = user.cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }))

    await Order.create({
      products,
      user: user._id
    })

    user.cart = []
    user.cartTotal = 0
    await user.save()

    res.status(201).json('ORDER CREATED')
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ err: 'Checkout failed' })
  }
})

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params
        if (req.body.name === '') throw new Error ('No Name')
        if (req.body.age === '') throw new Error ('No age')
        const oneOrder = await Order.findByIdAndUpdate(id, req.body, {new:true})
        res.status(202).json(oneOrder)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'})        
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params
        await Order.findByIdAndDelete(id)
        res.status(200).json({msg: 'Deleted'})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Delete'})
    }
})

module.exports = router