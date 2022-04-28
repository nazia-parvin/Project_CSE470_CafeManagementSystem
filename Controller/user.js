const express = require('express');
const connection = require('../Model');
const router = express.Router();
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
require('dotenv').config();

//const sendEmail = require('../email/mock') // For mocking email, check console log for email checking
const sendEmail = require('../email/gmail') // For gmail
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signup', (req, resp) => {
    let user = req.body;
    let query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        console.log(query);
        console.log(user);
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name, contact_number, email, password, status, role) values (?,?,?,?,0,'user')";
                connection.query(query, [user.name, user.contact_number, user.email, user.password], (err, results) => {
                    if (!err) {
                        return resp.status(200).json({ message: "Successfully registered" });
                    }
                    else
                        return resp.status(500).json({ message: err });
                });
            }
            else
                return resp.status(400).json({ message: "Email address already exists" });
        }
        else
            return resp.status(500).json(err);
    })
});

router.post("/login", (req, resp) => {
    const user = req.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        console.log(results);
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password)
                return resp.status(401).json({ message: "Incorrect username or password" });
            else if (results[0].status === 0) {
                return resp.status(401).json({ message: "Wait for admin approval" });
            }
            else if (results[0].password === user.password) {
                const payload = { email: results[0].email, role: results[0].role };
                accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                resp.status(200).json({ token: accessToken });
            }
            else return resp.status(400).json({ message: "Something went wrong. Please try again later." });
        }
        else
            return resp.status(500).json(err);
    });
});

router.post("/forgotPassword", (req, resp) => {
    const user = req.body;
    query = "select email, password from user where email=?";
    connection.query(query, [user.email], async (err, results) => {
        console.log(results);
        if (!err) {
            if (results.length <= 0){
                console.log("Email not in the database");
            }
            else {
                let result = await sendEmail(results[0].email,process.env.EMAIL_USER,"Password by Cafe Management System",`<p><b>Your login details</b><br/><b>Email:</b> ${results[0].email}<br/><b>Password:</b> ${results[0].password}<br/><br/><a href='${req.protocol + '://' + req.get("host")}' target='_blank' rel='noopener noreferrer'>Click here to login with your credentials</a></p>`);
                console.log("Result - " + result); // If you want to log what result was
            }
        }
        else
            return resp.status(500).json(err);
    });
    return resp.status(200).json({ message: "If the email associated matches with our records then we will send you details." });
});

router.get("/get",auth.authenticateToken, checkRole.checkRole, (req,resp) => {
    let query = "select id, name, contact_number, email, status from user where role ='user'";
    connection.query(query,(err,results)=>{
        if (!err)
        {
            return resp.status(200).json(results);
        }
        else
        {
            return resp.status(500).json(err);
        }
    });
});

router.patch("/update",auth.authenticateToken,checkRole.checkRole,(req, resp)=>{
    let user = req.body;
    let query = "update user set status =? where id=? and email!='admin@admin.com'";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err) {
            if(results.affectedRows === 1){
                resp.status(200).json({message:"Update successfully"})
            }
            else {
                resp.status(400).json({message:"Issue updating the status. Please provide correct id."})
            }
        }
        else
            resp.status(500).json(err);
    });
});

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:"Valid token"});

});

router.post('/changePassword',(req,resp)=>{
    let user = req.body;
    let query = "update user set password=? where email=? and email!='admin@admin.com' and password!=?";
    connection.query(query,[user.password,user.email,user.newPassword],(err,results)=>{
        if(!err)
        {
            if(results.affectedRows==1)
                return resp.status(200).json({message:"Password successfully updated"});
            else
                return resp.status(400).json({message: "Issue updating password for given email"});
        }
        else
            return resp.status(500).json(err);
    });
});

module.exports = router;
