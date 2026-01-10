import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";

export default class CheckStockUseCase {
  private _productRepository: ProductGateway;

  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }

  async execute(input: CheckStockInputDto): Promise<CheckStockOutputDto> {
    const props = {
      productId: input.productId
    };

    const result = await this._productRepository.find(props.productId);

    if (!result) {
      throw new Error("Product not found");
    }

    return {
      productId: result.id.id,
      stock: result.stock
    };
  }
}