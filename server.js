import dotenv from "dotenv";
import app from "./app.js";
import db from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  await db.sequelize.authenticate();
  console.log("DB Connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("DB error:", err);
}
