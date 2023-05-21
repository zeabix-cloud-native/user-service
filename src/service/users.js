const { sequelize } = require('../utils/db')
const ModelUser = require('../models/users.model')
const { v4:uuidv4 } = require('uuid');

const create = async(firstname, lastname, mobile, orgid) => {
    const User = ModelUser.schemas(sequelize);
    let user = await User.create({
        user_id: uuidv4(),
        firstname: firstname,
        lastname: lastname, 
        mobile: mobile,
        // All new user will be in standard tier
        membership_tier: ModelUser.tiers.STANDARD,
        org_id: orgid
    });

    return user;
}

const get = async(id) => {
    const User = ModelUser.schemas(sequelize);
    let user = await User.findOne({where: { user_id: id}});
    return user;
}

const update = async(id, data) => {
    const User = ModelUser.schemas(sequelize);
    let user = await User.findOne({where: {user_id: id}})
    if (user == null) throw new Error('User not found');

    let update = {}
    if (isAvailable(data.firstname)) update.firstname = data.firstname;
    if (isAvailable(data.lastname)) update.lastname = data.lastname;
    if (isAvailable(data.mobile)) update.mobile = data.mobile;
    if (isAvailable(data.membership_tier)) update.membership_tier = data.membership_tier;
    if (isAvailable(data.org_id)) update.org_id = data.org_id;

    console.log(`Update: ${JSON.stringify(update)}`)
    await User.update(update, {where : {user_id: id}})
    let updated = await User.findOne({where: {user_id: id}})

    return updated;
}

const getAll = async() => {
    const User = ModelUser.schemas(sequelize);
    let users = await User.findAll({ where: {}})
    return users;
}

const isAvailable = (data) => {
    return (data !== '' && data != null && data != undefined)
}

module.exports = {
    create,
    get,
    update,
    getAll
}