import express from "express";
import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { commentRouter } from "./modules/comments/comments.router";

const app = express();

app.use(
  cors({
    origin: process.env.API_URL || "http://localhost:4000",
    Credential: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.get("/", (req, res) => {
  res.send("Ki khbor ? valo to?");
});
export default app;
