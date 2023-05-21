const { DataTypes } = require('sequelize')

const schemas = (sequelize) => {
    const Org = sequelize.define("organization", {
        org_id: {
            type : DataTypes.STRING,
            primary: true 
        },
        name: DataTypes.STRING
    });

    return Org;
}

module.exports = {
    schemas
}
