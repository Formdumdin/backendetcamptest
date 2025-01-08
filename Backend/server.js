const express = require("express");
const cors = require("cors"); // เพิ่ม cors
const app = express();
app.use(cors());
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());

app.use(express.urlencoded({extended:true}));

const db = admin.firestore();

app.post('/create', async (req, res) => {
    try {
        console.log(req.body)
        const id = req.body.username;
        const userJson = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.firstname,
            sirname: req.body.sirname,
            THfirstname: req.body.THfirstname,
            THsirname: req.body.THsirname,
            phonenum: req.body.phonenum,
            Grade_level: req.body.Grade_level,
            School: req.body.School,
            province: req.body.province || req.body.provice // รองรับคำสะกดผิด
        };        
        console.log("Request Body:", req.body);
        const response = await db.collection("users").doc(id).set(userJson);
        console.log("Firebase Response:", response);        
        res.status(200).send({ message: "User created successfully!" });
    }   catch(error){
        res.send(error)
    }
})

app.get('/readusers', async (req, res) => {
    try{
        const usersRef = db.collection("users");
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    }catch(error){
        res.send(error);
    }
})

app.get('/readusers/:id', async (req, res) => {
    try {
      const userRef = db.collection("users").doc(req.params.id);
      const response = await userRef.get();
      if (!response.exists) {
        return res.status(404).send("User not found");
      }
      res.send(response.data());
    } catch (error) {
      res.status(500).send("Error retrieving user");
    }
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`)
})