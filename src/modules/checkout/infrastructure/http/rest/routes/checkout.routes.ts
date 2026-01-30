import express, { Request, Response } from 'express';
import { CheckoutRepository } from '../../../../repository/checkout/checkout.repository';
import PlaceOrderUseCase from '../../../../usecase/place-order/place-order.usecase';
import { PlaceOrderInputDto } from '../../../../usecase/place-order/place-order.dto';
import ClientAdmFacadeFactory from '../../../../../client-adm/factory/client-adm.facade.factory';
import ProductAdmFacadeFactory from '../../../../../product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../../../../store-catalog/factory/facade.factory';
import InvoiceFacadeFactory from '../../../../../invoice/factory/invoice.facade.factory';
import PaymentFacadeFactory from '../../../../../payment/factory/payment.facade.factory';

export const checkoutRouter = express.Router();

checkoutRouter.post("/", async (req: Request, res: Response) => {
  
  try {
    const {clientId, products} = req.body

    if (typeof clientId !== "string") {
      return res.status(400).send({ error: "data invalid" });
    }
    if (
      !Array.isArray(products) ||
      !products.every(
        (p) => typeof p === "object" && typeof p?.productId === "string"
      )
    ) {
      return res.status(400).send({ error: "data invalid" });
    }

    const input: PlaceOrderInputDto = {
      clientId,
      products
    };
    
    const checkoutRepository = new CheckoutRepository();
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      checkoutRepository,
      invoiceFacade,
      paymentFacade
    );
  
    const result = await placeOrderUseCase.execute(input)

    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }

});
