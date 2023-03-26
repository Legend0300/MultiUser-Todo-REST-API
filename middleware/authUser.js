express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const validateToken = asyncHandler( async (req, res, next) => {
    // const authHeader = req.headers['authorization'] || req.headers['x-access-token'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'No token provided'  , html: '<h1> No token provided </h1> <br> <a href="/api/home"> Go to home </a>'});
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken.user;
      next();   
    } catch (error) {
      res.status(401).json({ message: 'Invalid token'  , html: '<h1> No token provided </h1> <br> <a href="/api/home"> Go to home </a>'});
    }
  
})

module.exports = validateToken;