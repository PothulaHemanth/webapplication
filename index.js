var express = require('express');
var app = express();

app.use(express.static("public"));

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});
0
const db = getFirestore();
  
app.get('/signup', function (req, res) {  
  res.sendFile(__dirname + "/public/" + "signup.html")  
});

app.get('/login', function (req, res) {  
  res.sendFile(__dirname + "/public/" + "login.html") 
});

app.get("/dashboard", function (req, res) {
    res.sendFile(__dirname + "/public/" + "dashboard.html" );
    res.send("Hello");
});


app.get('/signupsubmit', function (req, res) {
  db.collection("Details").add({
    Name :req.query.name,
    email: req.query.email,
    password: req.query.password 
  })
  .then(() =>{
    const successMessage="Signup Succesfull. click here to <a href='/login'>Log in</a>.";
    res.send(successMessage);
  });
});

app.get("/loginSubmit", function (req, res) {
    const username = req.query.username;
    const password = req.query.password;

    db.collection("Details")
    .where("Fullname","==",username)
    
    .where("password","==" ,password)
    .get()
    
    .then  ((docs)=>{
        if(docs.size>0){
        res.send("<div class='center-message'>logged  in successfully.click here to view <a href='/dashboard'>dashboard</a>.</div>");
        }
        else{
            res.send("login failed");
        }
      })
      .catch(error => {
        // Proper error handling is missing. Provide meaningful error messages.
        console.error('Error fetching data:', error);
        res.send("An error occurred.");
    });
});

  
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})
