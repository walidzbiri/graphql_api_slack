module.exports = (sequelize, DataTypes) => {
    var Channel = sequelize.define('channel', {
         name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique:true
        },
         public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        }
    });
  
    Channel.associate = function(models) {
        // 1 Channel has 1 channel
        models.Channel.belongsTo(models.Team,{
            onDelete: "CASCADE",
            foreignKey:'teamId'
        });
    };
    return Channel;
};