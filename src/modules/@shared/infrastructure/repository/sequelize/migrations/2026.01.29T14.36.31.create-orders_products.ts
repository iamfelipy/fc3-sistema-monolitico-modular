import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('orders_products', {
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'orders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    product_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('orders_products');
}
