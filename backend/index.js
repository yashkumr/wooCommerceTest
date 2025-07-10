import express from "express"
import cors from "cors"
import morgan from "morgan"
import bodyParser from "body-parser";
import colors from "colors"
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js";
import path from "path";
import { fileURLToPath } from "url";

export const app = express();

dotenv.config();
connectDb();

 
//ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const buildpath = path.join(__dirname, "../frontend/dist")
app.use(express.static(buildpath));

//middleware

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));



//routing
app.use("/api/v1/auth", authRoutes);


app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });


  app.use("/", (req, res) => {
    res.send("welcome");
})

app.use("   ", (req, res) => {
    res.send("welcome");
})
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.bgCyan.white);
})
