import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { InvoiceItemsModel } from "../repository/invoice-items.model";
import InvoiceFacade from "./invoice.facade";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const repository = new InvoiceRepository();
    const addUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      addUsecase: addUsecase,
      findUsecase: undefined
    })

    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Street 1",
      number: "100",
      complement: "Apt 10",
      city: "Test City",
      state: "TS",
      zipCode: "12345-678",
      items: [
        { id: "i1", name: "Item 1", price: 55 },
        { id: "i2", name: "Item 2", price: 100 }
      ]
    };

    await facade.create(input);

    const invoice = await InvoiceModel.findOne({
      where: { name: input.name },
      include: [InvoiceItemsModel]
    });

    expect(invoice).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);

    expect(invoice.items.length).toBe(2); 
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.items[0].name).toBe(input.items[0].name);
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
  });

  it("should find an invoice", async () => {
    const invoiceInput = {
      id: "inv-2",
      name: "Invoice 2",
      document: "987654321",
      street: "Main St",
      number: "200",
      complement: "Suite 20",
      city: "Another City",
      state: "OS",
      zipCode: "87654-321",
      items: [
        { id: "prod1", name: "Product 1", price: 100 },
        { id: "prod2", name: "Product 2", price: 200 }
      ]
    };

    await InvoiceModel.create(
      {
        id: invoiceInput.id,
        name: invoiceInput.name,
        document: invoiceInput.document,
        street: invoiceInput.street,
        number: invoiceInput.number,
        complement: invoiceInput.complement,
        city: invoiceInput.city,
        state: invoiceInput.state,
        zipCode: invoiceInput.zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: invoiceInput.items.map(it => ({
          id: it.id,
          name: it.name,
          price: it.price,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      },
      {
        include: [InvoiceItemsModel]
      }
    );

    const facade = InvoiceFacadeFactory.create();

    const output = await facade.find({ id: invoiceInput.id });

    expect(output).toBeDefined();
    expect(output.id).toBe(invoiceInput.id);
    expect(output.name).toBe(invoiceInput.name);
    expect(output.document).toBe(invoiceInput.document);

    expect(output.address).toBeDefined();
    expect(output.address.street).toBe(invoiceInput.street);
    expect(output.address.number).toBe(invoiceInput.number);
    expect(output.address.complement).toBe(invoiceInput.complement);
    expect(output.address.city).toBe(invoiceInput.city);
    expect(output.address.state).toBe(invoiceInput.state);
    expect(output.address.zipCode).toBe(invoiceInput.zipCode);

    expect(Array.isArray(output.items)).toBe(true);
    expect(output.items.length).toBe(2);
    expect(output.items[0].id).toBe(invoiceInput.items[0].id);
    expect(output.items[0].name).toBe(invoiceInput.items[0].name);
    expect(output.items[0].price).toBe(invoiceInput.items[0].price);
    expect(output.items[1].id).toBe(invoiceInput.items[1].id);
    expect(output.items[1].name).toBe(invoiceInput.items[1].name);
    expect(output.items[1].price).toBe(invoiceInput.items[1].price);

    const totalExpected = invoiceInput.items.reduce((sum, item) => sum + item.price, 0);
    expect(output.total).toBe(totalExpected);
  });
});