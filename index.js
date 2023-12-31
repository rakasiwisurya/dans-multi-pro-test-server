require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/recruitment", router);

app.listen(process.env.PORT, () =>
  console.log(`Listening on http://localhost:${process.env.PORT}!`)
);
