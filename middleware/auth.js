const jwt = require('jsonwebtoken');
require("dotenv").config();


function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denited. please ');

    try{
        const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decode;
        next();
    }
    catch(ex){
        res.status(400).send("Invalid token");
    }
}


module.exports = auth;