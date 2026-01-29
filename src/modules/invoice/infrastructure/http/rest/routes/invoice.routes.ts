import express, { Request, Response } from 'express';
import { FindInvoiceUseCaseInputDTO } from '../../../../usecase/find-invoice/find-invoice.dto';
import InvoiceRepository from '../../../../repository/invoice.repository';
import FindInvoiceUseCase from '../../../../usecase/find-invoice/find-invoice.usecase';

export const invoicesRouter = express.Router();

invoicesRouter.get("/:id", async (req: Request, res: Response) => {
  
  try {
    const id = req.params?.id
    
    if(typeof id !== "string") {
      throw new Error("id is not valid")
    }

    const input: FindInvoiceUseCaseInputDTO = {
      id,
    };
    
    const invoiceRepository = new InvoiceRepository()
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository)
  
    const result = await findInvoiceUseCase.execute(input)

    res.send(result)
  } catch (err) {
    res.status(500).send(err)
  }

});
