const express = require('express');
const invoiceController = require('./controllers/invoiceController');

const router = express.Router();

router.post('/generate-invoice', invoiceController.generateInvoice);

module.exports = router;
