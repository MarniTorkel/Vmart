import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    String(req.headers.authorization).startsWith('Bearer')
  ) {
    try {
      token = String(req.headers.authorization).split(' ')[1]
      console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log(decoded, String(decoded.id))
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (e) {
      console.error(e)
      res.status(401)
      throw new Error('Not authorised, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorised user')
  }
}

export { protect, admin }
