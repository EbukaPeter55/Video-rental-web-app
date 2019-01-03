
module.exports = function (req, res, next) { 
  // 401 Unauthorized
  // 403 Forbidden 
  
  //If the user is not an Admin, send access denied, or if user is an admin run the next handler, thats the other route.
 if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  next();
}