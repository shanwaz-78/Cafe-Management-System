require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const userRoute = require("./routes/userRoute");
const port = process.env.PORT || "8000";
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/user", userRoute);
const server = http.createServer(app);
server.listen(port);

server.on("listening", () =>
  console.log(`Server is listening at localhost ${port}`)
);
server.on("error", () => console.log(`Server is not listening`));

