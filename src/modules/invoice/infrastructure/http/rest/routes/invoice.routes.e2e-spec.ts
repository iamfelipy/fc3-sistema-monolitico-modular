import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { Umzug } from 'umzug'
import { migrator } from '../../../../../@shared/infrastructure/repository/sequelize/config-migrations/migrator'
import Id from '../../../../../@shared/domain/value-object/id.value-object'
import { InvoiceModel } from '../../../../repository/invoice.model'
import { InvoiceItemsModel } from '../../../../repository/invoice-items.model'
import InvoiceEntity from '../../../../domain/invoice.entity'
import Address from '../../../../domain/value-object/address.value-object'
import InvoiceItem from '../../../../domain/invoice-items.entity'
import { app } from "../../../../../@shared/infrastructure/http/rest/express"

describe("invoice e2e test", () => {
  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    await sequelize.addModels([InvoiceModel, InvoiceItemsModel])
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

  it("should get a invoice", async () => {
    const invoiceDomain = new InvoiceEntity({
      id: new Id("invoice-1"),
      name: "Invoice 1",
      document: "123456789",
      address: new Address({
        street: "Street 1",
        number: "100",
        complement: "Apt 10",
        city: "Test City",
        state: "TS",
        zipCode: "12345-678"
      }),
      items: [
        new InvoiceItem({ id: new Id("i1"), name: "Item 1", price: 55 }),
        new InvoiceItem({ id: new Id("i2"), name: "Item 2", price: 100 })
      ]
    });

    await InvoiceModel.create(
      {
        id: invoiceDomain.id.id,
        name: invoiceDomain.name,
        document: invoiceDomain.document,
        
        street: invoiceDomain.address.street,
        number: invoiceDomain.address.number,
        complement: invoiceDomain.address.complement,
        city: invoiceDomain.address.city,
        state: invoiceDomain.address.state,
        zipCode: invoiceDomain.address.zipCode,
        
        createdAt: invoiceDomain.createdAt,
        updatedAt: invoiceDomain.updatedAt,
        
        items: invoiceDomain.items.map(item => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      },
      {
        include: [InvoiceItemsModel]
      }
    );

    const response = await request(app).get(`/invoices/${invoiceDomain.id.id}`)
    expect(response.status).toBe(200);

    // Output based on FindInvoiceUseCaseOutputDTO
    expect(response.body.id).toBe(invoiceDomain.id.id);
    expect(response.body.name).toBe(invoiceDomain.name);
    expect(response.body.document).toBe(invoiceDomain.document);

    expect(response.body.address).toEqual({
      street: invoiceDomain.address.street,
      number: invoiceDomain.address.number,
      complement: invoiceDomain.address.complement,
      city: invoiceDomain.address.city,
      state: invoiceDomain.address.state,
      zipCode: invoiceDomain.address.zipCode,
    });

    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBe(2);
    expect(response.body.items[0]).toEqual({
      id: invoiceDomain.items[0].id.id,
      name: invoiceDomain.items[0].name,
      price: invoiceDomain.items[0].price,
    });
    expect(response.body.items[1]).toEqual({
      id: invoiceDomain.items[1].id.id,
      name: invoiceDomain.items[1].name,
      price: invoiceDomain.items[1].price,
    });

    expect(response.body.total).toBe(
      invoiceDomain.items[0].price + invoiceDomain.items[1].price
    );

    expect(new Date(response.body.createdAt)).toEqual(invoiceDomain.createdAt);

  })
})