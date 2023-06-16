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
  userId: {
    type: DataTypes.UUID
  },
}, { tableName: 'event', paranoid: true });
Event.sync()

const Token = sequelize.define('token', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING,
  },
  platform: {
    type: DataTypes.STRING,
  }
}, { tableName: 'token', paranoid: true });
Token.sync()

module.exports = {
  User,
  Event,
  sequelize,
  Token,
}