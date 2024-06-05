const ejs = require('ejs');
const htmlPdf = require('html-pdf');
const fs = require('fs');
const { calculateNetAmount, calculateTax, amountToWords } = require('../utilts/calculations');

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

    const templatePath = './src/templates/template.ejs';
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

        htmlPdf.create(html).toBuffer((err, buffer) => {
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
