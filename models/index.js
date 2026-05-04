// // models/index.js
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import Sequelize from "sequelize";
// import process from "process";
// import configFile from "../config/config.cjs"; // IMPORTANT: .cjs

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const config = configFile[env];

// const db = {};

// let sequelize;

// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }

// // Read all model files
// const files = fs
//   .readdirSync(__dirname)
//   .filter(
//     (file) =>
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.endsWith(".js")
//   );

// for (const file of files) {
//   const modelModule = await import(path.join(__dirname, file));
//   const model = modelModule.default(sequelize, Sequelize.DataTypes);
//   db[model.name] = model;
// }

// // Run associations
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize from "sequelize";
import process from "process";
import configFile from "../config/config.cjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 👇 READ FILES
const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js")
  );

// 👇 FIXED IMPORT
for (const file of files) {
  const fullPath = path.join(__dirname, file);

  // 🔥 THIS LINE FIXES YOUR ERROR
  const module = await import(pathToFileURL(fullPath));

  const model = module.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;