const router = require("express").Router();

const accountBalanceController = require("./accountBalance/controllers/accountBalanceController");


//routes will be defined in default.json 
//Developer's Responsibility
router.post("/accountBalance", accountBalanceController.Controller);



module.exports = router;
