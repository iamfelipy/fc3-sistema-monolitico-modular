import express, { Request, Response } from 'express';
import ProductRepository from '../../../../repository/product.repository';
import AddProductUseCase from '../../../../usecase/add-product/add-product.usecase';
import { AddProductInputDto } from '../../../../usecase/add-product/add-product.dto';
import CheckStockUseCase from '../../../../usecase/check-stock/check-stock.usecase';
import { CheckStockInputDto } from '../../../../usecase/check-stock/check-stock.dto';

export const productsRouter = express.Router();

productsRouter.post("/", async (req: Request, res: Response) => {
  
  try {

    const addProductInputDto: AddProductInputDto = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };
    
    const productRepository = new ProductRepository()
    const addProductUseCase = new AddProductUseCase(productRepository)
  
    const result = await addProductUseCase.execute(addProductInputDto)

    res.send(result)
  } catch (err) {
    res.status(500).send(err)
  }

});

productsRouter.get("/:id/stock", async (req: Request, res: Response) => {
  
  try {
    const id = req.params?.id
    
    if(typeof id !== "string") {
      throw new Error("id is not valid")
    }

    const checkStockInputDto: CheckStockInputDto = {
      productId: id,
    };
    
    const productRepository = new ProductRepository()
    const checkStockUseCase = new CheckStockUseCase(productRepository)
  
    const result = await checkStockUseCase.execute(checkStockInputDto)

    res.send(result)
  } catch (err) {
    res.status(500).send(err)
  }

});
