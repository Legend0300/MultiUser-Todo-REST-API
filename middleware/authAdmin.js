express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const validateadminToken = asyncHandler( async (req, res, next) => {
    // const authHeader = req.headers['authorization'] || req.headers['x-access-token'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.adminjwt;

    if (!token) {
      return res.status(401).send(`message: 'No token provided' <br> html: '<h1> No token provided </h1> <br> <a href="/api/home"> <button>Go to home <button></a>`);
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
      req.user = decodedToken.user;
      next();   
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' , html: '<h1> No token provided </h1> <br> <a href="/api/home"> Go to home </a>' });
    }
  
})

module.exports = validateadminToken;