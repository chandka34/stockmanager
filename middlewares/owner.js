
function owner(req, res, next) {
    if (req.user.role!="owner")
      return res.status(403).send("You are not authorized");
      console.log(req.user.role);        
    next();
  }
  module.exports = owner;