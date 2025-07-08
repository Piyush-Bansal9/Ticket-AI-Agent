import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())
app.use("/api/auth", userRouter)



mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log("Server listening at port.");
        });
    })
    .catch((err) => {
        console.error("Error while connecting to database: ", err);
    })