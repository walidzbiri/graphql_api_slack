  
module.exports=(sequelize, DataTypes) => {
    const Member = sequelize.define('member');
    return Member;
  };