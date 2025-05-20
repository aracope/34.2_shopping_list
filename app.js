const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");

app.use(express.json());
app.use("/items", itemsRoutes);

module.exports = app;
