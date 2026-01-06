const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  console.log(req.headers)
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log(decoded)
      req.user = decoded.payload
      next()
    } catch (err) {
      console.log(err)
      res.status(401).json({ err: 'Invalid Token' })
    }
  } else {
    throw new Error('No Token')
  }
}

module.exports = verifyToken
