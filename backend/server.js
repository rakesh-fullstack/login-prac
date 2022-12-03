const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const UserRouter = require("./routes/user-route");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan("tiny"));
app.use(express.json());

app.use("/user/", UserRouter);

app.use("/", (req, res) => {
  res.status(200).send("Nodejs Server is Running");
});

app.listen(PORT, () => {
  console.log(`Server started on Port: ${PORT}`);
});
