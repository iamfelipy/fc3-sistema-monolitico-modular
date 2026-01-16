import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/value-object/address.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItem from "../../domain/invoice-items.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address({
  street: "Street 1",
  number: "123",
  complement: "Apt 4",
  city: "City",
  state: "State",
  zipCode: "12345-678"
});

const item1 = new InvoiceItem({
  id: new Id("i1"),
  name: "Item 1",
  price: 50,
  createdAt: new Date("2023-01-01T10:00:00Z"),
  updatedAt: new Date("2023-01-01T12:00:00Z"),
});

const item2 = new InvoiceItem({
  id: new Id("i2"),
  name: "Item 2",
  price: 100,
  createdAt: new Date("2023-01-02T10:00:00Z"),
  updatedAt: new Date("2023-01-02T12:00:00Z"),
});

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "123456789",
  address,
  items: [item1, item2],
  createdAt: new Date("2023-01-05T10:00:00Z"),
  updatedAt: new Date("2023-01-05T10:05:00Z"),
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual({
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });
    expect(result.items).toEqual([
      { id: item1.id.id, name: item1.name, price: item1.price },
      { id: item2.id.id, name: item2.name, price: item2.price }
    ]);
    expect(result.total).toEqual(item1.price + item2.price);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});