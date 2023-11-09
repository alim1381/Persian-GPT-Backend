const tokenSeparator = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(403).json({
      message: "توکن یافت نشد",
      success: false,
    });
  }
};

module.exports = tokenSeparator;
