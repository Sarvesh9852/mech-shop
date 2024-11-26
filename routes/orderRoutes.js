const express=require('express');
const { createOrder } = require('../controllers/ordercontrolar');
const router=express.Router();


router.route("/").post(createOrder)


module.exports = router;
