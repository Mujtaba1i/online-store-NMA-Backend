const mongoose = require('mongoose')

// we need mongoose schema
const productSchema = new mongoose.Schema(
{
    name: {
      type: String,
      required: true
    },
    imageLink: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password
  }
})

// then we register the model with mongoose
const Product = mongoose.model('Product', productSchema)

// export the model
module.exports = Product
