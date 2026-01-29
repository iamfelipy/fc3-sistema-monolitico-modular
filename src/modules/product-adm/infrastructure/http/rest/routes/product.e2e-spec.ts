import express, { Express } from 'express'
import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { Umzug } from 'umzug'
import { ProductModel } from '../../../../repository/product.model'
import { migrator } from '../../../../../@shared/infrastructure/repository/sequelize/config-migrations/migrator'
import Product from '../../../../domain/product.entity'
import Id from '../../../../../@shared/domain/value-object/id.value-object'
import { app } from '../../../../../@shared/infrastructure/http/rest/express'

describe("product e2e test", () => {

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    await sequelize.addModels([ProductModel])
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

  it("should create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "casa",
      description: "de bambu com armação",
      purchasePrice: 22,
      stock: 3,
    })
    
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe("casa")
    expect(response.body.description).toBe("de bambu com armação")
    expect(response.body.purchasePrice).toBe(22)
    expect(response.body.stock).toBe(3)

  })
  it("should find a product", async () => {

    const product = new Product({
        id: new Id("1"),
        name: "Test Product",
        description: "Test product description",
        purchasePrice: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    
    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })

    const response = await request(app).get(`/products/${product.id.id}/stock`);

    expect(response.status).toBe(200);
    expect(response.body.productId).toBe(product.id.id);
    expect(response.body.stock).toBe(product.stock);
  })
})