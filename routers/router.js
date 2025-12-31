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
    console.log(req.body);
    
    const date = new Date();
    const collection = await dataBaseMDB.collection(mongoDb_NAME).insertOne({
    userId : userId ,
    username : username ,
    content : content ,
    createdAt : date,
    updatedAt : date,

  });

  res.status(200).json({msg:"ok"})

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
  const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .updateOne({ _id: new ObjectId(id) },{$set:{updatedAt:new Date(),content:content}} )
  res.status(200).json({ msg: collection });
});

router.delete('/messages/:id', authenticateUser,async (req, res) => {
  const id = req.params.id;
   const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .deleteOne({ _id: new ObjectId(id) } )
  res.status(200).json({ msg: collection });
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
