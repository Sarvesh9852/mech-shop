const mongoose = require ('mongoose');

const FurnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Extra spaces remove karega
  },
  type: {
    type: String,
    required: true,
    enum: ['Chair', 'Table', 'window',
         'Bed', 'Rack', 'Custom'], // Furniture ke types define
  },
  dimensions: {
    length: { type: Number, required: true }, // in cm
    width: { type: Number, required: true },  // in cm
    height: { type: Number, required: true }, // in cm
  },

  description: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    default: 0, // Default stock value
    min: 0, // Stock negative nahi ho sakta
  },
  images: [
    {
      url: { type: String, required: true }, // Image URL
      altText: { type: String }, // Description for image
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Furniture creation time
  },
  order:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Order"
}],
},{timestamps:
true
});
const Furniture = mongoose.model('Furniture', FurnitureSchema);
module.exports = Furniture
