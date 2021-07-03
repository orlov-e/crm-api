const express = require("express")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const passport = require("passport")
const authRoutes = require("./routes/auth")
const analitycsRoute = require("./routes/analitycs")
const categoryRoutes = require("./routes/category")
const orderRoutes = require("./routes/order")
const positionRoutes = require("./routes/position")
const keys = require("./config/keys")
const app = express();

mongoose.connect(keys.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("mongodb connected"))
.catch(error => console.log("error"))
mongoose.set('useCreateIndex', true)

app.use(passport.initialize())
require("./middleware/passport")(passport)

app.use(require("cors")())
app.use(require("morgan")("dev"))
app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(bodyparser.json())
app.use("/uploads", express.static("uploads"))

app.use("/api/auth", authRoutes);
app.use("/api/analitycs", analitycsRoute);
app.use("/api/category", categoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/position", positionRoutes);

module.exports = app;