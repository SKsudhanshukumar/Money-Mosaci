import mongoose from "mongoose";

const Product = new mongoose.Schema({
  price: String,
  expense: String,
  transactions: [String], // Referencing transaction IDs as strings
});

export default mongoose.model("Product", Product);
