const express = require('express');
const service = require('../../service/users');
const validators = require('./validators')


const router = express.Router();

router.post('/', async (req, res) => {
    // Sanitize/Validate request
    const schemas = validators.createUserRequestValidator;
    const data = req.body;
    console.log(JSON.stringify(data));
    const { error, value } = schemas.validate(data);
    if (error){
        console.log('Invalid Request')
        res.status(400).json({
            error: "Invalid Request"
        }); 
        return;
    }

    console.log(JSON.stringify(value));
    console.log(JSON.stringify(data));

    let user = await service.create(value.firstname, value.lastname, value.mobile, value.org_id);
    console.log(`User created (${user.user_id})`)
    res.status(201).json(user);
});

router.get('/:userId', async (req, res) => {
    let userId = req.params.userId;
    console.log(`Get user profile (${userId})`);

    let user = await service.get(userId);
    if (user == null){
        console.log(`Get user not found: ${userId}`);
        res.status(404).json({
            error: "User Not Found"
        });
    } else {
        res.status(200).json(user);
    }
});

// Mass assignment
router.put('/:userId', async (req, res) => {
    let userId = req.params.userId
    console.log(`Update user profile (${userId})`);

    let user = await service.update(userId, req.body);
    if (user == null){
        res.status(404).json({
            error: "User not found"
        });
    } else {
        console.log(`User profile has been updated successfully (${userId})`)
        res.status(200).json(user);
    }
})


// Admin
router.get('/', async (req, res) => {
    let users = await service.getAll();
    res.status(200).json(users);
})

module.exports = router