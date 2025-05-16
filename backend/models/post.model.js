import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
  },
  price: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  video: {
    type: String,
    default: "",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  quantity:{
    type: Number,
    default: 1,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  category:{
    type: String,
    default: "All",
    enum:["Breakfast","Lunch","Dinner","Snacks","Dessert","Drinks","FastFood","Other","All"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10800, // 3 hours in seconds (only effective if TTL removal needed)
  },
});

export const Post = mongoose.model("Post", postSchema);
