module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
  });

  User.associate = function(models) {
    models.User.belongsToMany(models.Team,{
        through:'member',
        foreignKey:'userId'
    })
  };

  return User;
};