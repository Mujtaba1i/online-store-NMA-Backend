const mongoose = require('mongoose')

// we need mongoose schema
const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    notes: {
      type: String
    },
    quantity: {
      type: Number,
      required: true
    },
    status: {
      enum: [pending, approved, rejected],
      required: true,
      default: pending
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    Timestamps: true
  }
)

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password
  }
})

// then we register the model with mongoose
const Order = mongoose.model('Order', orderSchema)

// export the model
module.exports = Order
