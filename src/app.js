const express = require('express');
const cors = require('cors');
const { createHttpTerminator } = require('http-terminator')
require('log-timestamp');
const controller = require('./route/index')
const database = require('./utils/db');
const messaging = require('./utils/messaging');
const service = require('./service/organizations');



const port = process.env.PORT || 3000
const app = express();

app.use(cors())
app.use(express.json());
app.use('/', controller);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: "ok"
    })
})


const server = app.listen(port, async (error) => {
    if (error != null){
        console.log(`Unable to start http server, error: ${error}`);
        return;
    }
    await database.connect()
        .then(() => console.log(`Database is connected.`));

    await messaging.connect()
        .then(() => console.log(`Messaging is connected.`));

    await messaging.subscribe_create_event('org_creates', service.processOrgCreatedEvent)
        .then(() => console.log("Subscribed to Organization created event successfully"));
    
    await messaging.subscribe_update_event('org_updates', service.processOrgUpdatedEvent)
        .then(() => console.log("Subscribed to Organization changed event successfully"));

    console.log(`Server started, listening at ${port}`);    
})

const terminator = createHttpTerminator({
    server,
});


const gracfully = () => {
    console.log(`Gracfully shutting down server.`);
    terminator.terminate();
    console.log(`Cleanup pending request`);

    messaging.disconnect();
    console.log(`Disconnected messaging`);

    database.disconnect();
    console.log(`Disconnected database`);
}

process.on('SIGTERM', gracfully);
process.on('SIGINT', gracfully);
