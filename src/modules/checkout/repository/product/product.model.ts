import { BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderModel } from "../order/order.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;

  @BelongsToMany(() => OrderModel, {
    through: "orders_products",
    foreignKey: "product_id",
    otherKey: "order_id",
  })
  orders: OrderModel[];

  @Column({ allowNull: false, field: 'created_at' })
  createdAt: Date;

  @Column({ allowNull: false, field: 'updated_at' })
  updatedAt: Date;
}