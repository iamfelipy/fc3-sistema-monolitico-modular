import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { ClientModel } from "../client/client.model";
import { OrderModel } from "../order/order.model";
import { ProductModel } from "../product/product.model";

export class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const orderModel = await OrderModel.create({
      id: order.id.id,
      clientId: order.client.id.id,
      status: order.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await orderModel.$set(
      "products",
      order.products.map((product) => product.id.id)
    );
  }

  async findOrder(id: string){
    const orderDb = await OrderModel.findOne({
      where: { id },
      include: [ClientModel, ProductModel],
    });

    if(!orderDb) {
      return null
    }

    return new Order({
      id: new Id(orderDb.id),
      client: new Client({
        id: new Id(orderDb.client.id),
        name: orderDb.client.name,
        email: orderDb.client.email,
        address: new Address(
          orderDb.client.street,
          orderDb.client.number,
          orderDb.client.complement,
          orderDb.client.city,
          orderDb.client.state,
          orderDb.client.zipCode
        ),
        createdAt: orderDb.client.createdAt,
        updatedAt: orderDb.client.updatedAt,
      }),
      products: orderDb.products.map(
        (product) =>
          new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          })
      ),
      status: orderDb.status,
      createdAt: orderDb.createdAt,
      updatedAt: orderDb.updatedAt,
    });
  }
}
