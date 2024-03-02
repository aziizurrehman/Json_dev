const router = require("express").Router();

const accountStatementController = require("./AccountStatement/controllers/accountStatementController");
const accountBalanceController = require("./accountBalance/controllers/accountBalanceController");


//routes will be defined in default.json 
//Developer's Responsibility
router.post("/accountStatement", accountStatementController.Controller);
router.post("/accountBalance", accountBalanceController.Controller);



module.exports = router;
