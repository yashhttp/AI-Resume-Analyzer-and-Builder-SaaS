const roleMiddleware = (allowedRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      })
    }

    if (req.user.role !== allowedRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      })
    }

    next()
  }
}

export default roleMiddleware