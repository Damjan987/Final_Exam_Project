const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDb = require("./database/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/company");
const beerRoutes = require("./routes/beer");
const postRoutes = require("./routes/post");

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/beer", beerRoutes);
app.use("/api/post", postRoutes);

connectDb();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
