const express = require('express');
const router = express.Router();
const { generateInvoice } = require('./controllers/invoiceController');

router.post('/generate-invoice', generateInvoice);

module.exports = router;
