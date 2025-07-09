import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())
app.use("/api/auth", userRouter);
app.use("/api/tickets", ticketRoutes);

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreated],
    })
);

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