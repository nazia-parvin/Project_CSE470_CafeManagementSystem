const express = require('express');
const connection = require('../Model');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetailsReport);

    var query = "insert into bill (name,uuid,email,contact_number,paymentMethod,total,productDetails,createdBy) values (?,?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name, generatedUuid.uuid, orderDetails.email, orderDetails.contact_number, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contact_number: orderDetails.contact_number, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    pdf.create(results).toFile('./generated_pdf/' + generatedUuid + "pdf", function (err, data) {//changed data to results
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }
                        else {
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    });
                }
            })
        }
        else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;