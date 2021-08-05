'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Video.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    link: DataTypes.STRING,
    kind: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
    channelId: DataTypes.STRING,
    channelTitle: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    thumbnail: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'video',
    modelName: 'Video',
  });
  return Video;
};