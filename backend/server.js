const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const UserRouter = require("./routes/user-route");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan("tiny"));
app.use(express.json());

app.use("/health", (req, res) => {
  res.status(200).send("System is Up");
});

app.use("/user/", UserRouter);

app.listen(PORT, () => {
  console.log(`Server started on Port: ${PORT}`);
});
