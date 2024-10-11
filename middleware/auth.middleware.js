import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = decode.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "Internal server error",
    });
  }
};
