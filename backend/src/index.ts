import express from "express";
import dotenv from "dotenv";
import { Logger } from "./lib/logger";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8848;

app.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    Logger.info("Received request for root endpoint");
    res.send("Here we are!");
});