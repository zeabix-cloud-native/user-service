const { DataTypes } = require('sequelize')
const tiers = {
    STANDARD: "standard",
    GOLD: "gold",
    PLATINUM: "platinum"
}

const schemas = (sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
            type : DataTypes.STRING,
            primary: true 
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        mobile: DataTypes.STRING,
        membership_tier: DataTypes.STRING,
        org_id: DataTypes.STRING
    });

    return User;
}

module.exports = {
    schemas,
    tiers
}
