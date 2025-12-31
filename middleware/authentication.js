import { checkUser,checkUserId } from "../services/auth.js";



export async function authenticateUser(req, res, next) {
  try {
    // const username = req.headers["x-username"];
    // const password = req.headers["x-password"];
    const {password,username} = req.body

    if (!username || !password) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }
    const checkUsername = await checkUser(username, password);
    if (checkUsername === "userFound!") {
      req.authenticateUser = username;
      // const getUser = await getAllUsers();
      // console.log(getUser);
      next();
    } else {
      res.status(200).json({ msg: "failure login" });
    }
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function authenticateId(req, res, next) {
  try {
    // const username = req.headers["x-username"];
    // const password = req.headers["x-password"];
    const {username,userId} = req.body

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }
    const checkUserid = await checkUserId(username, userId);
    
    if (checkUserid === "userIdFound!") {

      next();
    } else {
      res.status(404).json({ msg: "user id is not found" });
    }
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
  































