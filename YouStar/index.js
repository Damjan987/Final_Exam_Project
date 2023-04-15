const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDb = require("./database/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const chatRoutes = require("./routes/chat");

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static("uploads"));

connectDb();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
