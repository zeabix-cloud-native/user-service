const express = require('express')
const validator = require('./validators')

const service = require('../../service/users');
const router = express.Router();


/**
 * Always sanitize your input to prevent
 * Mass Assignment (see example from /v1/)
 */
router.put('/:userId', async (req, res) => {
    let userId = req.params.userId;
    let data = req.body;

    // Sanitize input
    const schemas = validator.updateUserRequestValidator;
    let {error, value} = schemas.validate(data);

    if (error){
        res.status(400).json({
            error: "Invalid Request"
        })
        return;
    }

    let user = await service.update(userId, value)

    if (user == null){
        res.status(404).json({
            error: 'User not found'
        });
        return;
    }

    res.status(200).json(user)

})

module.exports = router;