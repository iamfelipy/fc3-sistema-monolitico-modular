import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate invoice use case unit test", () => {
  it("should be able to generate an invoice", async () => {
    const MockRepository = () => {
      return {
        add: jest.fn(),
        find: jest.fn()
      };
    };

    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);
    
    // Arrange
    const input = {
      name: "Customer 1",
      document: "123456789",
      street: "Street 1",
      number: "10A",
      complement: "Apt 101",
      city: "Cityville",
      state: "ST",
      zipCode: "12345-678",
      items: [
        { id: "1", name: "Item 1", price: 50 },
        { id: "2", name: "Item 2", price: 100 },
      ],
    };


    // Act
    const result = await usecase.execute(input);

    // Assert
    expect(invoiceRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(150);

  });
});