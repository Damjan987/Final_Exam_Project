const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const BeerSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    alcoholPercentage: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    company: {
      type: ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

const Beer = mongoose.model("Beer", BeerSchema);

module.exports = Beer;
