import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

import postRoutes from "./routes/posts.js";
import userRouter from "./routes/user.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/posts", postRoutes);
app.use("/api/user", userRouter);

app.use(express.static('client/build'));
app.get('*', function (req, res) {
	res.sendFile(path.resolve('client', 'build', 'index.html'));
});

app.get("/", (req, res) => {
	res.send("App is Running !!");
});

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
	.catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);

