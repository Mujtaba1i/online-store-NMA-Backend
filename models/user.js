const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true
  }
})
// we need mongoose schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "seller", "customer"],
      default: "customer"
    },
    wantToBeSeller: {
      type: Boolean,
      default: false
    },
    cart: [cartSchema],
    cartTotal: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password
  }
})

// then we register the model with mongoose
const User = mongoose.model('User', userSchema)

// export the model
module.exports = User
