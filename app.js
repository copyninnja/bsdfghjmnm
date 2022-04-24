const express = require("express");
const port = process.env.PORT || 3000;
const compression = require("compression");
const path = require("path");
const app = express();
app.use(express.urlencoded());
app.use(express.json());
// view engine setup
app.set("views", path.join(__dirname, "static", "views"));
app.set("view engine", "ejs");
app.use(compression());
app.use("/public", express.static(path.join(__dirname, "static", "public")));
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://fooddelivery-1a5c1-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: process.env.BUCKET_URL,
});
let db = admin.firestore();
let a = db.collection("users");
app.post("/data", async (req, res) => {
  let docRef = a.doc(req.body.user.name);
  await docRef.set({
    age: req.body.user.age,
  });
  res.send("done");
});
app.listen(port, (req, res) => {
  console.info(`Running on ${port}`);
});
