import express, { Express } from "express";
import { productsRouter } from "../../../../product-adm/infrastructure/http/rest/routes/product.routes";
import { clientsRouter } from "../../../../client-adm/infrastructure/http/rest/routes/client.routes";
import { invoicesRouter } from "../../../../invoice/infrastructure/http/rest/routes/invoice.routes";
import { checkoutRouter } from "../../../../checkout/infrastructure/http/rest/routes/checkout.routes";


export const app: Express = express();

app.use(express.json());

// routes
app.use('/products', productsRouter)
app.use('/clients', clientsRouter)
app.use('/invoices', invoicesRouter)
app.use('/checkout', checkoutRouter)