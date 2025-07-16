import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  console.log("🔍 Token found:", token);

  if (!token) {
    console.log("❌ No token found in cookies or headers");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      console.log("❌ JWT verification error:", err.message);
      return res.status(403).json({ message: "Token is not valid or expired." });
    }
    req.userId = payload.id;
    req.userRole = payload.role;
    console.log(`✅ Verified user: ID=${req.userId}, Role=${req.userRole}`);
    next();
  });
};

export const optionalVerifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.userRole = "guest";
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      req.userRole = "guest";
      return next();
    }
    req.userId = payload.id;
    req.userRole = payload.role;
    console.log(`✅ Verified user: ID=${req.userId}, Role=${req.userRole}`);
    next();
  });
};
