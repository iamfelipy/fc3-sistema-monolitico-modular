import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import { ClientModel } from "../client/client.model"
import { ProductModel } from "../product/product.model";
import { OrderModel } from "../order/order.model";
import Product from "../../domain/product.entity";
import { Sequelize } from "sequelize-typescript";
import { CheckoutRepository } from "./checkout.repository";

describe("checkout repository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel, ClientModel, OrderModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a order", async () => {
    // ---------- client ----------
    const client1 = new Client({
      id: new Id("1"),
      name: "John Doe",
      email: "john@example.com",
      address: new Address(
        "Main St",
        "123",
        "Apt 4",
        "Metropolis",
        "SP",
        "12345-678"
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  
    await ClientModel.create({
      id: client1.id.id,
      name: client1.name,
      email: client1.email,
      street: client1.address.street,
      number: client1.address.number,
      complement: client1.address.complement,
      city: client1.address.city,
      state: client1.address.state,
      zipCode: client1.address.zipCode,
      createdAt: client1.createdAt,
      updatedAt: client1.updatedAt,
    });
  
    // ---------- products ----------
    const product1 = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "First product",
      salesPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  
    const product2 = new Product({
      id: new Id("2"),
      name: "Product 2",
      description: "Second product",
      salesPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  
    await ProductModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
      createdAt: product1.createdAt,
      updatedAt: product1.updatedAt,
    });
  
    await ProductModel.create({
      id: product2.id.id,
      name: product2.name,
      description: product2.description,
      salesPrice: product2.salesPrice,
      createdAt: product2.createdAt,
      updatedAt: product2.updatedAt,
    });
  
    // ---------- order ----------
    const order = new Order({
      id: new Id("1"),
      client: client1,
      products: [product1, product2],
    });
  
    const checkoutRepository = new CheckoutRepository();
    await checkoutRepository.addOrder(order);
  
    // ---------- assert ----------
    const orderDb = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [ClientModel, ProductModel],
    });

    expect(orderDb).toBeDefined();
    expect(orderDb.id).toBe(order.id.id);
    expect(orderDb.status).toBe(order.status);
  
    // client
    expect(orderDb.client.id).toBe(client1.id.id);
    expect(orderDb.client.name).toBe(client1.name);
    expect(orderDb.client.email).toBe(client1.email);
  
    // products
    expect(orderDb.products).toHaveLength(2);
  
    const productIds = orderDb.products.map((p) => p.id);
    expect(productIds).toContain(product1.id.id);
    expect(productIds).toContain(product2.id.id);
  });
  it("should find a order", async () => {
  
    const client1 = new Client({
      id: new Id("1"),
      name: "John Doe",
      email: "john@example.com",
      address: new Address(
        "Main St",
        "123",
        "Apt 4",
        "Metropolis",
        "SP",
        "12345-678"
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await ClientModel.create({
      id: client1.id.id,
      name: client1.name,
      email: client1.email,
      street: client1.address.street,
      number: client1.address.number,
      complement: client1.address.complement,
      city: client1.address.city,
      state: client1.address.state,
      zipCode: client1.address.zipCode,
      createdAt: client1.createdAt,
      updatedAt: client1.updatedAt,
    });
  
    const product1 = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "First product",
      salesPrice: 100,
    });
    const product2 = new Product({
      id: new Id("2"),
      name: "Product 2",
      description: "Second product",
      salesPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  
    await ProductModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
      createdAt: product1.createdAt,
      updatedAt: product1.updatedAt,
    });
  
    await ProductModel.create({
      id: product2.id.id,
      name: product2.name,
      description: product2.description,
      salesPrice: product2.salesPrice,
      createdAt: product2.createdAt,
      updatedAt: product2.updatedAt,
    });
  
    const order = new Order({
      id: new Id("1"),
      client: client1,
      products: [
        product1,
        product2
      ]
    });
  
    await OrderModel.sequelize.transaction(async (t) => {
      const orderModel = await OrderModel.create({
        id: order.id.id,
        clientId: client1.id.id,
        status: order.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction: t });
      await orderModel.$set(
        "products",
        [product1.id.id, product2.id.id],
        { transaction: t }
      );
    });

    const checkoutRepository = new CheckoutRepository()
    const orderDomain = await checkoutRepository.findOrder(order.id.id)
  
    expect(orderDomain).toBeDefined();
    expect(orderDomain.id.id).toBe(order.id.id);
    expect(orderDomain.status).toBe(order.status);
  
    // Check client fields
    expect(orderDomain.client).toBeDefined();
    expect(orderDomain.client.id.id).toBe(client1.id.id);
    expect(orderDomain.client.name).toBe(client1.name);
    expect(orderDomain.client.email).toBe(client1.email);
    expect(orderDomain.client.address.street).toBe(client1.address.street);
    expect(orderDomain.client.address.number).toBe(client1.address.number);
    expect(orderDomain.client.address.complement).toBe(client1.address.complement);
    expect(orderDomain.client.address.city).toBe(client1.address.city);
    expect(orderDomain.client.address.state).toBe(client1.address.state);
    expect(orderDomain.client.address.zipCode).toBe(client1.address.zipCode);
  
    // Check products
    expect(orderDomain.products).toBeDefined();
    expect(orderDomain.products.length).toBe(2);
  
    const productIds = orderDomain.products.map((p) => p.id.id);
    expect(productIds).toContain(product1.id.id);
    expect(productIds).toContain(product2.id.id);
  
    const dbProduct1 = orderDomain.products.find((p) => p.id.id === product1.id.id);
    expect(dbProduct1).toBeDefined();
    expect(dbProduct1.name).toBe(product1.name);
    expect(dbProduct1.description).toBe(product1.description);
    expect(dbProduct1.salesPrice).toBe(product1.salesPrice);
  
    const dbProduct2 = orderDomain.products.find((p) => p.id.id === product2.id.id);
    expect(dbProduct2).toBeDefined();
    expect(dbProduct2.name).toBe(product2.name);
    expect(dbProduct2.description).toBe(product2.description);
    expect(dbProduct2.salesPrice).toBe(product2.salesPrice);
  })
})
