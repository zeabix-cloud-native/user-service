const express = require('express');
const userV1 = require('./v1/users');
const userV2 = require('./v2/users');

const router = express.Router();

router.use('/v1/users', userV1);
router.use('/v2/users', userV2);

module.exports = router;
