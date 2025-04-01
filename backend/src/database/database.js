import Sequelize from 'sequelize';

export const sequelize = new Sequelize('postgres', 'postgres', 'patita123', {
    host: 'localhost',
    dialect: 'postgres',
});

