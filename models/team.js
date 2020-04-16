module.exports = (sequelize, DataTypes) => {
    var Team = sequelize.define('team', {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique:true
      }
    });
  
    Team.associate = function(models) {
        // 1 team has many users
         models.Team.belongsToMany(models.User,{
          through:'member',
          foreignKey:'teamId'
         });
        // 1 team has 1 owner
        models.Team.belongsTo(models.User,{
            onDelete: "CASCADE",
            foreignKey:'owner'
        });
    };
    return Team;
};