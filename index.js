import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 4000;


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
    
}))

app.use("/api/v1/users", userRouter);



app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`)
})
