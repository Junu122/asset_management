import bodyParser from "body-parser";
import sequelize from "./config/db.js";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import employeeRouter from "./routes/employeeRoutes.js";
import categoryRouter from "./routes/assetsCategoryRoutes.js";
import assetsRouter from "./routes/assetsRouter.js";
import stockRouter from "./routes/stockRouter.js";
import assetHistoryRouter from "./routes/assetHistoryRoutes.js";
import indexRouter from "./routes/index.js";
import dotenv from "dotenv";
const app = express();
app.use(express.json());

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/employees", employeeRouter);
app.use("/assetcategories", categoryRouter);
app.use("/assets", assetsRouter);
app.use("/stocks", stockRouter);
app.use("/assethistory", assetHistoryRouter);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

sequelize
  .sync({ force: false })
  .then(() => {
    console.log(" synced .");
    app.listen(3000, () => console.log(" Server started on port 3000"));
  })
  .catch((err) => console.error(" Sync failed", err));
