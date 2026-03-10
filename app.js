import express from "express";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());
app.use("/", orderRoutes);

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
