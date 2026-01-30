import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('orders', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: true
    },

    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "client_id",
      references: {
        model: 'clients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
  await sequelize.getQueryInterface().dropTable('orders')
} 
