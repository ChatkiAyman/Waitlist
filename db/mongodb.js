import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose;
  mongoose
    .set("strictQuery", true)
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: "true",
      useUnifiedTopology: "true",
      dbName: "PreMechSpy",
    })
    .then(() => {
      console.log("connected to db");
    })
    .catch((error) => console.log(error));
};

export default connectDB;