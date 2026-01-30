import { app } from "./express";
import dotenv from "dotenv";

import { Sequelize } from "sequelize-typescript";
import { OrderModel as OrderModelCheckout } from "../../../../checkout/repository/order/order.model";
import { ProductModel as ProductModelCheckout } from "../../../../checkout/repository/product/product.model";
import { ProductModel as ProductModelProductAdm } from "../../../../product-adm/repository/product.model";
import ProductModelStoreCatalog  from "../../../../store-catalog/repository/product.model";
import { ClientModel as ClientModelClientAdm } from "../../../../client-adm/repository/client.model";
import { ClientModel as ClientModelCheckout } from "../../../../checkout/repository/client/client.model";
import TransactionModelPayment from "../../../../payment/repository/transaction.model";
import { InvoiceModel } from "../../../../invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../../../invoice/repository/invoice-items.model";
import { migrator } from "../../repository/sequelize/config-migrations/migrator";
import { Umzug } from "umzug";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    OrderModelCheckout, 
    ProductModelCheckout, 
    ProductModelProductAdm,
    ProductModelStoreCatalog, 
    ClientModelClientAdm, 
    ClientModelCheckout, 
    TransactionModelPayment, 
    InvoiceModel, 
    InvoiceItemsModel
  ]);
  let migration: Umzug<any> = migrator(sequelize)
  await migration.up()
}
setupDb();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
}); 