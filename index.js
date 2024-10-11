import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./routes/user.route.js"

dotenv.config();
const PORT = process.env.PORT || 4000;


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    Credential: true
}))

app.use(express.json());

app.use("/api/v1/users", userRouter);



app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`)
})
