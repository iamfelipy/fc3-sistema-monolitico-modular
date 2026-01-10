import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

describe("Check Stock use case unit test", () => {
  it("should check the stock of a product", async () => {
    
    const product = new Product(
      {
        id: new Id("id-product-1"),
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    )

    const MockRepository = () => {
      return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(product),
      };
    };
    
    const productRepository = MockRepository();
    const usecase = new CheckStockUseCase(productRepository);

    const input = {
      productId: "id-product-1"
    };

    const result = await usecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.productId).toBe(product.id.id);
    expect(result.stock).toBe(product.stock);
  });
});