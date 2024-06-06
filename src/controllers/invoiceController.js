const ejs = require('ejs');
const htmlPdf = require('html-pdf');
const phantomjs = require('phantomjs-prebuilt');
const path = require('path');
const fs = require('fs');
const { calculateNetAmount, calculateTax } = require('../utilts/calculations');
const { amountToWords } = require('../utilts/convertAmountToWords');

const generateInvoice = (req, res) => {
    const {
        seller,
        placeOfSupply,
        billing,
        shipping,
        placeOfDelivery,
        order,
        invoice,
        reverseCharge,
        items,
        logo,
        signature
    } = req.body;

    // Calculate derived fields for items
    items.forEach(item => {
        item.netAmount = calculateNetAmount(item.unitPrice, item.quantity, item.discount);
        item.taxType = placeOfSupply === placeOfDelivery ? 'CGST/SGST' : 'IGST';
        item.taxRate = placeOfSupply === placeOfDelivery ? 9 : 18;
        item.taxAmount = calculateTax(item.netAmount, item.taxRate);
        item.totalAmount = item.netAmount + item.taxAmount;
    });

    // Calculate total amount and amount in words
    const totalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);
    const amountInWords = amountToWords(totalAmount);

    const templatePath = path.join(__dirname, '../templates/template.ejs');
    const templateData = {
        seller,
        placeOfSupply,
        billing,
        shipping,
        placeOfDelivery,
        order,
        invoice,
        reverseCharge,
        items,
        totalAmount,
        amountInWords,
        logo,
        signature
    };

    ejs.renderFile(templatePath, templateData, (err, html) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        const options = {
            phantomPath: phantomjs.path,
            format: 'Letter'
        };

        htmlPdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.setHeader('Content-Disposition', 'attachment;filename=invoice.pdf');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(buffer);
        });
    });
};

module.exports = {
    generateInvoice
};
