const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pokemon = new Schema({
  name: { type: String, required: true },
  elements: {
    type: Number,
  },
});

module.exports = mongoose.model("Pokemon", Pokemon);
