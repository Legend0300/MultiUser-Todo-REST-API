express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const validateToken = asyncHandler( async (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['x-access-token'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        res.status(401);
        throw new Error('No token provided');
    }
    try {
      console.log(token);
        verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        next();
    }
    catch(error) {
        // console.log(error);
        res.status(401);
        throw new Error('Invalid token');
    }
})

module.exports = validateToken;