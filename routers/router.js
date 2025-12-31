import express from "express";
import supabase from "../db/connectSupabase.js";
import {authenticateUser,authenticateId} from "../middleware/authentication.js";
import dataBaseMDB from "../db/connectMongoDb.js";
import { ObjectId } from "mongodb";
import 'dotenv/config'
const router = express();
const mongoDb_NAME = process.env.MONGODB_NAME;

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }
    const { error } = await supabase
      .from("users")
      .insert({ username: username, password: password });
    res.status(200).json({ msg: "ok" });
    if (error) {
      console.log(error);

      return res.status(404).json({ msg: error });
    }
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", authenticateUser, async (req, res) => {
  res.status(200).json({ massege: "success login " });
});

router.post("/messages", authenticateUser,authenticateId, async (req, res) => {
    const {content,username,userId} = req.body;
    if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "Content cannot be empty" });
  }
  if (content.length > 500) {
    return res.status(400).json({ error: "Content too long (max 500 chars)" });
  }
    
    const date = new Date();
    const collection = await dataBaseMDB.collection(mongoDb_NAME).insertOne({
    userId : userId ,
    username : username ,
    content : content ,
    createdAt : date,
    updatedAt : date,

  });

  res.status(200).json({msg:"Message created"})

});

router.get('/messages',authenticateUser,async(req,res)=>{
    const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .find()
    .toArray();
  res.status(200).json({ msg: collection.sort((a, b) => a.createdAt - b.createdAt) });

});

router.get('/messages/user/:userId',authenticateUser,async(req,res)=>{
    const userId = req.params.userId
    const id = parseInt(userId)
    const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .find({userId:id})
    .toArray();
    
    res.status(200).json({ msg: collection });

});
router.put("/messages/:id",authenticateUser, async (req, res) => {
  const id = req.params.id;
  const content = req.body.content
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Message ID format" });
  }
  const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .findOne({ _id: new ObjectId(id) });
    if (!collection) return res.status(404).json({ error: "Message not found" });
    if (message.username !== req.authenticatedUser) {
      return res.status(403).json({ error: "Unauthorized: This is not your message" });
    }
    if (!content || content.length > 500) {
      return res.status(400).json({ error: "Invalid content length" });
    }
    await dataBaseMDB
    .collection(mongoDb_NAME)
    .updateOne({$set:{updatedAt:new Date(),content:content}});
    res.status(200).json({ msg: collection });
  });

router.delete('/messages/:id', authenticateUser,async (req, res) => {
  const id = req.params.id;
  const username = req.headers["x-username"];
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Message ID format" });
  }
   const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .findOne({ _id: new ObjectId(id) } );
    if (!collection) {
    return res.status(404).json({ msg: "Message not found" });
  }
  if (message.username !== req.authenticatedUser) {
    return res.status(403).json({ msg: "Unauthorized: You can only delete your own messages" });
  }
  await dataBaseMDB.collection("messages").deleteOne({ _id: new ObjectId(msgId) });
  res.status(200).json({ msg: "Deleted successfully" });
});



export default router;





// router.post("/reports", async (req, res) => {
//   const { fieldCode, location, threatLevel, description, confirmed } = req.body;
//   if (!fieldCode || !location || !threatLevel || !description) {
//     return res
//       .status(401)
//       .json({ error: "Missing parameter or wrong parameter" });
//   }
//   if (
//     typeof fieldCode !== "string" &&
//     typeof location !== "string" &&
//     typeof description !== "string"
//   ) {
//     return res.status(401).json({
//       error: "fieldCode or location or description not typeof string",
//     });
//   }
//   if (typeof threatLevel !== "number" && threatLevel < 1 && threatLevel > 5) {
//     return res
//       .status(401)
//       .json({ error: " threatLevel not typeof number or not between 1-5" });
//   }
//   if (typeof confirmed !== "boolean") {
//     return res.status(401).json({ error: " threatLevel not typeof boolean" });
//   }
//   if (!confirmed) {
//     confirmed = false;
//   }
//   const collection = await dataBase.collection(db_collection).insertOne({
//     fieldCode: fieldCode,
//     location: location,
//     threatLevel: threatLevel,
//     description: description,
//     timestamp: new Date(),
//     confirmed: confirmed,
//   });
//   res.status(200).json({ id: collection.insertedId });
// });







































































// // router.js

// // --- 1. Register: בדיקת משתמש קיים (Unique Username) ---
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
    
//     // בדיקה אם המשתמש כבר קיים בסופאבייס לפני הרישום
//     const { data: existingUser } = await supabase
//       .from("users")
//       .select("username")
//       .eq("username", username)
//       .single();

//     if (existingUser) {
//       return res.status(409).json({ error: "Username already exists" });
//     }

//     const { error } = await supabase
//       .from("users")
//       .insert({ username, password });

//     if (error) throw error;
//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // --- 2. Create Message: בדיקת אורך תוכן (Input Length) ---
// router.post("/messages", authenticateUser, authenticateId, async (req, res) => {
//   const { content, username, userId } = req.body;

//   // ולידציה על אורך התוכן
//   if (!content || content.trim().length === 0) {
//     return res.status(400).json({ error: "Content cannot be empty" });
//   }
//   if (content.length > 500) {
//     return res.status(400).json({ error: "Content too long (max 500 chars)" });
//   }

//   const date = new Date();
//   await dataBaseMDB.collection("messages").insertOne({
//     userId: parseInt(userId),
//     username: username,
//     content: content,
//     createdAt: date,
//     updatedAt: date,
//   });

//   res.status(200).json({ msg: "Message created" });
// });

// // --- 3. Get User Messages: בדיקה שמשתמש רואה רק את שלו ---
// router.get('/messages/user/:userId', authenticateUser, async (req, res) => {
//   const requestedId = parseInt(req.params.userId);
//   const loggedInUsername = req.authenticatedUser;

//   // שליפת המשתמש המחובר מסופאבייס כדי להשוות ID
//   const { data: user } = await supabase
//     .from("users")
//     .select("id")
//     .eq("username", loggedInUsername)
//     .single();

//   if (user.id !== requestedId) {
//     return res.status(403).json({ error: "Forbidden: You can only view your own messages" });
//   }

//   const messages = await dataBaseMDB
//     .collection("messages")
//     .find({ userId: requestedId })
//     .toArray();
    
//   res.status(200).json({ msg: messages });
// });

// // --- 4. Update/Delete: בדיקת ObjectId ובעלות (Ownership) ---
// router.put("/messages/:id", authenticateUser, async (req, res) => {
//   const msgId = req.params.id;
//   const { content } = req.body;

//   // א. בדיקת פורמט ObjectId תקין למניעת קריסה
//   if (!ObjectId.isValid(msgId)) {
//     return res.status(400).json({ error: "Invalid Message ID format" });
//   }

//   // ב. מציאת ההודעה ובדיקת בעלות
//   const message = await dataBaseMDB.collection("messages").findOne({ _id: new ObjectId(msgId) });
  
//   if (!message) return res.status(404).json({ error: "Message not found" });

//   // בדיקה אם המשתמש המחובר (מהמידלוור) הוא בעל ההודעה
//   if (message.username !== req.authenticatedUser) {
//     return res.status(403).json({ error: "Unauthorized: This is not your message" });
//   }

//   // ג. בדיקת תוכן חדש
//   if (!content || content.length > 500) {
//     return res.status(400).json({ error: "Invalid content length" });
//   }

//   await dataBaseMDB.collection("messages").updateOne(
//     { _id: new ObjectId(msgId) },
//     { $set: { updatedAt: new Date(), content: content } }
//   );

//   res.status(200).json({ msg: "Updated successfully" });
// });

// router.delete('/messages/:id', authenticateUser, async (req, res) => {
//   const msgId = req.params.id;

//   if (!ObjectId.isValid(msgId)) {
//     return res.status(400).json({ error: "Invalid Message ID format" });
//   }

//   const message = await dataBaseMDB.collection("messages").findOne({ _id: new ObjectId(msgId) });
  
//   if (!message) return res.status(404).json({ error: "Message not found" });

//   if (message.username !== req.authenticatedUser) {
//     return res.status(403).json({ error: "Unauthorized: You cannot delete this message" });
//   }

//   await dataBaseMDB.collection("messages").deleteOne({ _id: new ObjectId(msgId) });
//   res.status(200).json({ msg: "Deleted successfully" });
// });