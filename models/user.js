const mongoose = require('mongoose')

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
    cart: {
      type: Array
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
