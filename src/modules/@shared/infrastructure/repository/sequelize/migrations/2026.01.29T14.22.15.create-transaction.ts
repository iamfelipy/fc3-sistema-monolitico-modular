import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('transactions', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: true
    },

    orderId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "order_id"
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "updated_at"
    }
  })
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('transactions')
} 
