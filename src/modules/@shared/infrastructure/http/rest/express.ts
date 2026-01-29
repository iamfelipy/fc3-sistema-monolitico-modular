import express, { Express } from "express";
import { productsRouter } from "../../../../product-adm/infrastructure/http/rest/routes/product.routes";
import { clientsRouter } from "../../../../client-adm/infrastructure/http/rest/routes/client.routes";
import { invoicesRouter } from "../../../../invoice/infrastructure/http/rest/routes/invoice.routes";


export const app: Express = express();

app.use(express.json());

// routes
app.use('/products', productsRouter)
app.use('/clients', clientsRouter)
app.use('/invoices', invoicesRouter)


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