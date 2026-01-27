import express, { Express } from "express";

export const mainRouter = express.Router();

export const app: Express = express();
// faz o parse do body das requisições
app.use(express.json());
app.use("/", mainRouter);

// export let sequelize: Sequelize;

// async function setupDb() {
//   sequelize = new Sequelize({
//     dialect: "sqlite",
//     storage: ":memory:",
//     logging: false,
//   });
//   await sequelize.addModels([CustomerModel, ProductModel]);
//   await sequelize.sync();
// }
// setupDb();