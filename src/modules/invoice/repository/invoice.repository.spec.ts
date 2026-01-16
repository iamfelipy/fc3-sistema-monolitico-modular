import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice-items.entity";
import Address from "../domain/value-object/address.value-object";
import { InvoiceItemsModel } from "./invoice-items.model";
import { InvoiceModel } from "./invoice.model";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice with items using sequelize", async () => {
    // Arrange
    const address = new Address({
      street: "Test Street",
      number: "111",
      complement: "Apt 1",
      city: "Test City",
      state: "ST",
      zipCode: "12345-678"
    });

    const item1 = new InvoiceItem({
      id: new Id("i1"),
      name: "Item 1",
      price: 42.5,
    });

    const item2 = new InvoiceItem({
      id: new Id("i2"),
      name: "Item 2",
      price: 100,
    });

    const invoice = new Invoice({
      id: new Id("inv1"),
      name: "Test Invoice",
      document: "12345678900",
      address,
      items: [item1, item2],
    });

    // Act: Save to database using Sequelize directly
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode, 
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map(item => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          invoiceId: invoice.id.id, 
        }))
      },
      {
        include: [InvoiceItemsModel],
      }
    );

    // Assert: Fetch and validate from the database
    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: [{ model: InvoiceItemsModel }]
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toBe(invoice.id.id);
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.street).toBe(invoice.address.street);
    expect(invoiceDb.number).toBe(invoice.address.number);
    expect(invoiceDb.complement).toBe(invoice.address.complement);
    expect(invoiceDb.city).toBe(invoice.address.city);
    expect(invoiceDb.state).toBe(invoice.address.state);
    expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);

    expect(invoiceDb.items.length).toBe(2);

    expect(invoiceDb.items[0].id).toBe(item1.id.id);
    expect(invoiceDb.items[0].name).toBe(item1.name);
    expect(invoiceDb.items[0].price).toBe(item1.price);

    expect(invoiceDb.items[1].id).toBe(item2.id.id);
    expect(invoiceDb.items[1].name).toBe(item2.name);
    expect(invoiceDb.items[1].price).toBe(item2.price);

    // Total
    const total = invoiceDb.items.reduce((sum, item) => sum + item.price, 0);
    expect(total).toBe(142.5);
  });
});