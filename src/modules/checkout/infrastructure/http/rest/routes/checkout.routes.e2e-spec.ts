import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { Umzug } from 'umzug'
import { migrator } from '../../../../../@shared/infrastructure/repository/sequelize/config-migrations/migrator'
import { app } from "../../../../../@shared/infrastructure/http/rest/express"
import { OrderModel } from "../../../../repository/order/order.model"
import { PlaceOrderInputDto } from "../../../../usecase/place-order/place-order.dto"
import { ClientModel } from "../../../../repository/client/client.model"
import { ClientModel as ClientModelClientAdm } from "../../../../../client-adm/repository/client.model"
import { ProductModel } from "../../../../repository/product/product.model"
import ProductModelStoreCatalog from "../../../../../store-catalog/repository/product.model"
import { ProductModel as ProductModelProductAdm } from "../../../../../product-adm/repository/product.model"
import TransactionModel from "../../../../../payment/repository/transaction.model"
import { InvoiceModel } from "../../../../../invoice/repository/invoice.model"
import { InvoiceItemsModel } from "../../../../../invoice/repository/invoice-items.model"
import ClientAdmFacadeFactory from "../../../../../client-adm/factory/client-adm.facade.factory"
import ProductAdmFacadeFactory from "../../../../../product-adm/factory/facade.factory"

describe("checkout e2e test", () => {
  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    await sequelize.addModels([OrderModel, ProductModel, ClientModel, ClientModelClientAdm, ProductModelStoreCatalog, ProductModelProductAdm, TransactionModel, InvoiceModel, InvoiceItemsModel])
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }

    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("should create a checkout", async () => {
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    await clientAdmFacade.add({
      id: "1c",
      name: "Client 0",
      email: "client@user.com",
      document: "1234567899",
      address: {
        street: "some address",
        number: "1",
        complement: "",
        city: "some city",
        state: "some state",
        zipCode: "000",
      },
    })

    const productAdmFacade = ProductAdmFacadeFactory.create();
    await productAdmFacade.addProduct({
      id: "1p",
      name: "Product 1",
      description: "some description",
      purchasePrice: 12,
      stock: 10
    })
    await ProductModelStoreCatalog.update(
      { salesPrice: 60 },
      {
        where: {
          id: "1p",
        },
      }
    );
    await productAdmFacade.addProduct({
      id: "2p",
      name: "Product 2",
      description: "some description",
      purchasePrice: 33,
      stock: 10
    })
    await ProductModelStoreCatalog.update(
      { salesPrice: 40 },
      {
        where: {
          id: "2p",
        },
      }
    );
    
    const input: PlaceOrderInputDto = {
      clientId: "1c",
      products: [
        {productId: "1p"},
        {productId: "2p"}
      ]
    }

    const response = await request(app).post(`/checkout`).send(input)
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      invoiceId: expect.any(String),
      status: 'approved',
      total: 100,
      products: [
        { productId: '1p' },
        { productId: '2p' }
      ]
    });
  })
})