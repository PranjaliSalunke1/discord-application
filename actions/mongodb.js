const mongoose = require("mongoose");
const uri =
  "mongodb+srv://pranjaliramdassalunkedeviic:PranjaliServer123@cluster0.22dopbz.mongodb.net/";

try {
  mongoose.connect(uri);

  console.log("connected to mongodb");
} catch (error) {
  console.error("error onnecting to database", error);
}
