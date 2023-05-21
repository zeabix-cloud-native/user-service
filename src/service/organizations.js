const { sequelize } = require('../utils/db')
const ModelOrg = require('../models/orgs.model')

const processOrgCreatedEvent = async ({ topic, partition, message }) => {
    console.log(`Incomming messages`)
    console.log(`Topic: ${topic}`)
    console.log(`Partition: ${partition}`)

    let data = message.value.toString();
    console.log(`Message: ${data}`)

    orgCreatedEvent = JSON.parse(data);
    const Org = ModelOrg.schemas(sequelize);

    const org = await Org.create({
        org_id: orgCreatedEvent.orgId,
        name: orgCreatedEvent.orgName
    })

    console.log(`Organization is created successfully, id: ${org.org_id}, name: ${org.name}`);

}

const processOrgUpdatedEvent = async ({ topic, partition, message }) => {
    console.log(`Incomming messages`)
    console.log(`Topic: ${topic}`)
    console.log(`Partition: ${partition}`)

    let data = message.value.toString();
    console.log(`Message: ${data}`)



    const orgUpdateEvent = JSON.parse(data);

    if (orgUpdateEvent.orgName === '' || orgUpdateEvent.orgName == null || orgUpdateEvent.orgName == undefined){
        console.error(`New Organization name is not defined: ${orgUpdateEvent.orgName}`);
        throw new Error('Invalid organization name')
    }

    const Org = ModelOrg.schemas(sequelize);

    const org = await Org.findOne({where : {org_id : orgUpdateEvent.orgId }})
    if (org == null){
        console.error(`Organization is not found (${orgUpdateEvent.orgId})`);
        throw new Error('Organization not found');
    }

    const update = {
        name: orgUpdateEvent.orgName
    }

    await Org.update(update, {where : {org_id: orgUpdateEvent.orgId}})
    console.log(`Organization is updated successfully with id: ${orgUpdateEvent.orgId}, name: ${orgUpdateEvent.orgName}`);
}  

module.exports = {
    processOrgUpdatedEvent,
    processOrgCreatedEvent
}