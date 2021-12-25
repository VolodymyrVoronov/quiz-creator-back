import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET_TOKEN);

      req.userId = decodedData?.id;
    }

    next();
  } catch (error) {
    res
      .status(NETWORK_STATUS.NOT_FOUND)
      .json({ message: "Token has been expired. Please sign in again." });
    console.log(error);
  }
};

export default protect;
