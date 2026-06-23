import mongoose from "mongoose";

const dbConnect = async () => {
 const URL = process.env.MONGODB_URL;
    try {
    await mongoose.connect(`${URL}/clutch`);
    console.log("DB connection successful");
  }
   catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default dbConnect;
// module.exports = dbConnect;


