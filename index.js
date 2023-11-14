const express = require("express");

// Get routes to the variabel
const router = require("./routes");

const app = express();

app.use(express.json());

app.use("/api/", router);

app.listen(process.env.PORT, () =>
  console.log(`Listening on http://localhost:${process.env.PORT}!`)
);
