import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ClientModel } from "../client/client.model";
import { ProductModel } from "../product/product.model";


@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;
  
  @Column({ allowNull: false })
  status: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false, field: 'client_id' })
  clientId: string;

  @BelongsTo(() => ClientModel)
  client: ClientModel;

  @BelongsToMany(() => ProductModel, {
    through: "orders_products",
    foreignKey: "order_id",
    otherKey: "product_id",
  })
  products: ProductModel[];

  @Column({ allowNull: false, field: 'created_at' })
  createdAt: Date;

  @Column({ allowNull: false, field: 'updated_at' })
  updatedAt: Date;
}