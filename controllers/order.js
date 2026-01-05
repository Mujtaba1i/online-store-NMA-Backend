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

router.post('/', async (req, res) => {
    try {
        const creatdOrder = await Order.create(req.body)
        res.status(201).json(creatdOrder)        
    } catch (err) {
        console.log(err.message)
        res.status(422).json({err: 'Failed to Create'})
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