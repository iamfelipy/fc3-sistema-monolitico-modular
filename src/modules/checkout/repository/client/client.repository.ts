import { Sequelize } from "sequelize-typescript";
import Client from "../../domain/client.entity";
import { ClientGateway } from "../../gateway/client.gateway";
import { ClientModel } from "./client.model";
import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";

export class ClientRepository implements ClientGateway {
  constructor() {}

  async add(client: Client) {
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

      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    })
  }

  async find(id: string) {
    const clientDb = await ClientModel.findOne({
      where: {
        id
      }
    })

    if(!clientDb) {
      return null
    }

    const clientDomain = new Client({
      id: new Id(clientDb.id),
      name: clientDb.name,
      email: clientDb.email,
      address: new Address(
        clientDb.street,
        clientDb.number,
        clientDb.complement,
        clientDb.city,
        clientDb.state,
        clientDb.zipcode,
      ),
      createdAt: clientDb.createdAt,
      updatedAt: clientDb.updatedAt
    })

    return clientDomain
  }
}