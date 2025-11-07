
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: "" // optional image URL
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    default: ""
  }
},
{
    timestamps:true
});

export default mongoose.model("Product", productSchema);
