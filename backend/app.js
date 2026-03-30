const express = require("express");


const userRouter = require("./routes/userRoutes.js");
const noteRouter = require("./routes/noteRoutes.js");
const logRouter = require("./routes/logRoute.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "https://myrealnotes.netlify.app", 
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/notes", noteRouter);
app.use("/logs", logRouter);

app.get("/", (req, res) => {
  res.send("Welcome please login to access the notes");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
