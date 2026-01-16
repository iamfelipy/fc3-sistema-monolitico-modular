import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice-items.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemsModel } from "./invoice-items.model";

export default class InvoiceRepository implements InvoiceGateway {
  async add(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map(item => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          invoiceId: invoice.id.id
        }))
      },
      {
        include: [InvoiceItemsModel],
      }
    );
  }

  async find(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemsModel }],
    });

    if (!invoiceModel) {
      throw new Error("Invoice not found");
    }

    const invoice = new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: new Address({
        street: invoiceModel.street,
        number: invoiceModel.number,
        complement: invoiceModel.complement,
        city: invoiceModel.city,
        state: invoiceModel.state,
        zipCode: invoiceModel.zipCode,
      }),
      items: invoiceModel.items.map(
        (item: InvoiceItemsModel) =>
          new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })
      ),
      createdAt: invoiceModel.createdAt,
      updatedAt: invoiceModel.updatedAt,
    });

    return invoice;
  }
}