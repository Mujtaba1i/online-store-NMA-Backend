const Order = require('../models/order')
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


module.exports = router