const router = require("express").Router();

const accountBalance = require("./index");


//Developer's Responsibility
router.use('/v1', accountBalance)




module.exports = router;
