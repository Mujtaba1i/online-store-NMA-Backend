const mongoose = require('mongoose')

// we need mongoose schema
const orderSchema = mongoose.Schema(
  {
    product: {
      type: String,
      required: true
    },
    notes: {
      type: String
    },
    quantity: {
      type: Number,
      required: true
    },
    status: {
      enum: [pending, approved, rejected]
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
const order = mongoose.model('order', orderSchema)

// export the model
module.exports = order
