import express, { Express } from 'express'
import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { Umzug } from 'umzug'
import { ProductModel } from '../../../../repository/product.model'
import { migrator } from '../../../../../@shared/infrastructure/repository/sequelize/config-migrations/migrator'
import { productsRootRouter } from './product.routes'

describe("product e2e test", () => {

  const app: Express = express()
  app.use(express.json())
  app.use("/", productsRootRouter)

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
})