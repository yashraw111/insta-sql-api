const express = require("express");
const app = express();
require("dotenv").config({ debug: false });

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRoute = require("./routes/index.route");

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", indexRoute);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
