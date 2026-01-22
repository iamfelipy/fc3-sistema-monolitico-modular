import { Sequelize } from "sequelize-typescript"
import Address from "../../../@shared/domain/value-object/address.value-object"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import { ClientModel } from "./client.model"
import { ClientRepository } from "./client.repository"

describe("client repository test", () => {
  let sequelize: Sequelize
  
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  })
  afterEach(async ()=> {
    await sequelize.close();
  })
  it("should create a client", async () => {
      const client = new Client({
        id: new Id("1"),
        name: "cesar",
        email: "cesar@gmail.com",
        address: new Address(
          "Rua Teste",
          "123",
          "Apto 10",
          "Cidade Teste",
          "Estado Teste",
          "12345-678"
        )
      })

      const repository = new ClientRepository()
      await repository.add(client)

      const clientDb = await ClientModel.findOne({
        where: {
          id: "1"
        }
      })

      expect(clientDb).toBeDefined()
      expect(clientDb.id).toBe(client.id.id)
      expect(clientDb.name).toBe(client.name)
      expect(clientDb.email).toBe(client.email)

      expect(clientDb.street).toBe(client.address.street)
      expect(clientDb.number).toBe(client.address.number)
      expect(clientDb.complement).toBe(client.address.complement)
      expect(clientDb.city).toBe(client.address.city)
      expect(clientDb.state).toBe(client.address.state)
      expect(clientDb.zipcode).toBe(client.address.zipCode)

      expect(clientDb.createdAt).toEqual(client.createdAt)
      expect(clientDb.updatedAt).toEqual(client.updatedAt)
  })
  it("should find a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    })

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipcode: client.address.zipCode,
      
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const repository = new ClientRepository()
    const clientDb = await repository.find(client.id.id)

    expect(clientDb).toBeDefined()
    expect(clientDb).toEqual(client)
  })
})