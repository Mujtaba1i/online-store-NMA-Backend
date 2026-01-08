const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product' 
        },
        quantity: { 
          type: Number, 
          required: true }

      }
    ],
    notes: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  },
  { timestamps: true }
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
