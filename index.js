require("dotenv").config();

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")

const PORT = 4000 || process.env.PORT;

const app = express();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err);
    })

app.use(cors({
    origin: ["http://localhost:3000"]
}))

app.use(express.json())
app.use(express.static(path.join(__dirname, "files")));

app.use("/register", require("./register"))

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})