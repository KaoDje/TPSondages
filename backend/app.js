const express = require("express");
const { ObjectId } = require("mongodb");
const cors = require("cors");

const hostname = "127.0.0.1";
const port = 3000;
const app = express();

app.use(express.json());

app.use(cors());

const sondagesRouter = require("./routers/sondages");
const reponsesRouter = require("./routers/reponses");

app.use("/sondages", sondagesRouter);
app.use("/reponses", reponsesRouter);
app.use("/", (req, res) => {
  res.send({ id: new ObjectId().toString() });
});

// Middleware d'erreur
app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ success: false, error: error.message, status: error.status });
});

app.listen(port, hostname, () => {
  console.log("server is running on port " + port);
});
