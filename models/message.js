module.exports = (sequelize, DataTypes) => {
    var Message = sequelize.define('message', {
      text: {
          type: DataTypes.STRING,
          allowNull: false
      }
    });
  
    Message.associate = function(models) {
        // 1 Message has 1 owner
        models.Message.belongsTo(models.User,{
            onDelete: "CASCADE",
            foreignKey:'userId'
        });
        // 1 Message has 1 channel
        models.Message.belongsTo(models.Channel,{
            onDelete: "CASCADE",
            foreignKey:'channelId'
        });
    };
    return Message;
};