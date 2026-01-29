import express, { Request, Response } from 'express';
import ClientRepository from '../../../../repository/client.repository';
import AddClientUseCase from '../../../../usecase/add-client/add-client.usecase';
import { AddClientInputDto } from '../../../../usecase/add-client/add-client.dto';
import { FindClientInputDto } from '../../../../usecase/find-client/find-client.usecase.dto';
import FindClientUseCase from '../../../../usecase/find-client/find-client.usecase';


export const clientsRouter = express.Router();

clientsRouter.post("/", async (req: Request, res: Response) => {
  
  try {

    const { name, email, document, address } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof document !== "string" ||
      typeof address !== "object" ||
      typeof address?.street !== "string" ||
      typeof address?.number !== "string" ||
      typeof address?.complement !== "string" ||
      typeof address?.city !== "string" ||
      typeof address?.state !== "string" ||
      typeof address?.zipCode !== "string"
    ) {
      return res.status(400).send({ error: "Client data invalid" });
    }

    const addClientInputDto: AddClientInputDto = {
      name,
      email,
      document,
      address: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      }
    };
    
    const clientRepository = new ClientRepository()
    const addClientUseCase = new AddClientUseCase(clientRepository)
  
    const result = await addClientUseCase.execute(addClientInputDto)

    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }

});

clientsRouter.get("/:id", async (req: Request, res: Response) => {
  
  try {
    const id = req.params?.id
    
    if (typeof id !== "string") {
      return res.status(400).send({ error: "Client data invalid" });
    }

    const findClientInputDto: FindClientInputDto = {
      id: id,
    };
    
    const clientRepository = new ClientRepository()
    const findClientUseCase = new FindClientUseCase(clientRepository)
  
    const result = await findClientUseCase.execute(findClientInputDto)

    res.send(result)
  } catch (err) {
    res.status(500).send(err)
  }

});
