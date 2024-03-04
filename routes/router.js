const router = require("express").Router();

const Account = require("./index");


//Developer's Responsibility
router.use('/v1/account', Account)




module.exports = router;
