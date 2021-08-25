const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")))

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
})
    .then(() => console.log("connection successful!!"))
    .catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"images")
    }, filename: (req, file, cb) => {
        cb(null, req.body.name);
        },
})
    
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has Been Uploaded");
    // res.status(200).json({
    // message: 'File has Been Uploaded',
        
    // })
})


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname,"/client/build/")));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'));
//       });
// }

app.listen(process.env.PORT|| 8000, () => {
    console.log("Backend is running");
});