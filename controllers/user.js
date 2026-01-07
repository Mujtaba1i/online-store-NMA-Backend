const User = require('../models/user')
const express = require('express')
const router = express.Router()

router.get('/customers', async (req,res) =>{
    try {
        const allUsers = await User.find({role: 'customer', wantToBeSeller: false})
        res.status(200).json(allUsers)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'}) 
    }
})

router.get('/sellers-request', async (req,res) =>{
    try {
        const allUsers = await User.find({role: 'customer', wantToBeSeller: true})
        res.status(200).json(allUsers)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'}) 
    }
})

router.get('/sellers', async (req,res) =>{
    try {
        const allUsers = await User.find({role: 'seller'})
        res.status(200).json(allUsers)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'}) 
    }
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const oneUser = await User.findById(id).populate('cart.product')
        if (!oneUser) {
            res.status(404).json({err: 'User Not Found'})
        } else {
            res.status(200).json({oneUser})
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'})        
    }
})

router.post('/', async (req, res) => {
    try {
        const creatdUser = await User.create(req.body)
        res.status(201).json(creatdUser)        
    } catch (err) {
        console.log(err.message)
        res.status(422).json({err: 'Failed to Create'})
    }

})

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const oneUser = await User.findByIdAndUpdate(id, req.body, {new:true})
        res.status(202).json(oneUser)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Fetch Data'})        
    }
})

router.put('/:id/updateCart', async (req, res) => {
  try {
    const { id } = req.params
    const { productId, action } = req.body

    const foundUser = await User.findById(id)

    const foundItem = foundUser.cart.find(
      item => item.product.toString() === productId
    )

    if (action === 'increment') {
      if (foundItem) {
        foundItem.quantity += 1
      } else {
        foundUser.cart.push({ product: productId, quantity: 1 })
      }
      foundUser.cartTotal += 1
      await foundUser.save()
      return res.status(202).json('ADDED TO CART')
    }

    if (action === 'decrement' && foundItem) {
      foundItem.quantity -= 1
      foundUser.cartTotal -= 1

      if (foundItem.quantity <= 0) {
        foundUser.cart = foundUser.cart.filter(
          item => item.product.toString() !== productId
        )
      }

      await foundUser.save()
      return res.status(202).json('ADDED TO CART')
    }
    
    if (action === 'delete' && foundItem) {
      foundUser.cartTotal -= foundItem.quantity
      foundUser.cart = foundUser.cart.filter(
        item => item.product.toString() !== productId
      )

      await foundUser.save()
      return res.status(202).json('DELETED FROM CART')
    }

    res.status(400).json({ err: 'Invalid action' })

  } catch (err) {
    console.log(err.message)
    res.status(500).json({ err: 'Failed to Fetch Data' })
  }
})


router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params
        await User.findByIdAndDelete(id)
        res.status(200).json({msg: 'Deleted'})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({err: 'Failed to Delete'})
    }
})

module.exports = router