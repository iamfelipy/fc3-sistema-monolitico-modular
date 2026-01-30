import express, { Express } from 'express'
import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { Umzug } from 'umzug'
import { migrator } from '../../../../../@shared/infrastructure/repository/sequelize/config-migrations/migrator'
import Id from '../../../../../@shared/domain/value-object/id.value-object'
import { ClientModel } from '../../../../repository/client.model'
import Client from '../../../../domain/client.entity'
import Address from '../../../../../@shared/domain/value-object/address.value-object'
import { app } from '../../../../../@shared/infrastructure/http/rest/express'

describe("client e2e test", () => {
  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    await sequelize.addModels([ClientModel])
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

  it("should create a client", async () => {
    const response = await request(app).post("/clients").send({
      name: "cesar",
      email: "cesar@email.com",
      document: "12345678900",
      address: {
        street: "Rua A",
        number: "10",
        complement: "Apto 102",
        city: "Cidade Exemplo",
        state: "SP",
        zipCode: "12345-678"
      }
    })
    
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe("cesar")
    expect(response.body.email).toBe("cesar@email.com")
    expect(response.body.document).toBe("12345678900")
    expect(response.body.address).toEqual({
      street: "Rua A",
      number: "10",
      complement: "Apto 102",
      city: "Cidade Exemplo",
      state: "SP",
      zipCode: "12345-678",
    })
    expect(response.body.createdAt).toBeDefined()
    expect(response.body.updatedAt).toBeDefined()

  })
  it("should find a client", async () => {

    const client = new Client({
        id: new Id("1"),
        name: "cesar",
        email: "cesar@email.com",
        document: "12345678900",
        address: new Address(
          "Rua A",
          "10",
          "Apto 102",
          "Cidade Exemplo",
          "SP",
          "12345-678"
        ),
        createdAt: new Date(),
        updatedAt: new Date()
    })
    
    await ClientModel.create({
      id: client.id.id,
      
      name: client.name,
      email: client.email,
      document: client.document,
      
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    })

    const response = await request(app).get(`/clients/${client.id.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(client.id.id);
    expect(response.body.name).toBe(client.name);
    expect(response.body.email).toBe(client.email);
    expect(response.body.document).toBe(client.document);
    expect(response.body.address).toEqual({
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
    });
    expect(new Date(response.body.createdAt)).toEqual(client.createdAt);
    expect(new Date(response.body.updatedAt)).toEqual(client.updatedAt);
  })
})