const { Sequelize, DataTypes } = require("sequelize");
const { configService } = require('./utils')

const sequelize = new Sequelize(configService.get('DATABASE_NAME'), configService.get('DATABASE_USER'), configService.get('DATABASE_PASS'), {
  host: configService.get('DATABASE_HOST'),
  dialect: 'mysql'
});

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  wxOpenId: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
}, { tableName: 'user', paranoid: true });
User.sync()

const Event = sequelize.define('event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  happenTime: {
    type: DataTypes.DATE
  },
}, { tableName: 'event', paranoid: true });
Event.sync()

module.exports = {
  User,
  Event,
  sequelize,
}