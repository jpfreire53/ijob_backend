const jwt = require("jsonwebtoken");
const SECRET = "750139581985";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.cookie;

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido", type: "e" });
  }

  try {
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido", type: "e" });
  }
};

module.exports = authMiddleware;
