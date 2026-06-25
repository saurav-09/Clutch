import mongoose from "mongoose";

const connectionSchema=new mongoose.Schema({
  from_user_id:{
    type:String,
    ref:'User',
    required:true,
  },
  to_user_id:{
    type:String,
    ref:'User',
    required:true,
  },
  status:{
    type:String,
    enum:["pending","accepted"],
    default:"pending",
  },

}, { timestamps: true });

const Connection = mongoose.model('Connection',connectionSchema);

export default Connection;

// {timestamps:true,minimize:false}
// Changed type: String ➝ type: mongoose.Schema.Types.ObjectId for both from_user_id and to_user_id.
// Kept ref: "User" so you can use Mongoose’s populate() to fetch full user details.

