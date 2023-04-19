
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser')
const { fileLoader } = require('ejs');
const req = require('express/lib/request');
const app = express();
app.use(express.static('public'))
const{Schema,model}=mongoose;
app.set('view engine','ejs')
mongoose.set('strictQuery',false)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// const passport = require('passport')
mongoose.connect("mongodb+srv://Anuj:mongo@cluster0.vx1w3df.mongodb.net/companies")
const session = require('express-session');
app.use(session({
  secret: '37b412c2348c0d903bfb9f7cf9b37e77d85a1e161da1c1762d2e3d48e3e3d4b0ca75432a2564d4c50ab4d0c84e21cc1f8c108fbb12a60ddc2189b25eaf0c91400',
  resave: false,
  saveUninitialized: true,
}));

function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}
// images used
const marquee = "https://i.ibb.co/YNT2Q9Y/marquee-company.jpg"
const super_dream = "https://i.ibb.co/hdCbBc0/76.jpg"
const dream = "https://i.ibb.co/QkBr66c/51584.jpg"
const Day = "https://i.ibb.co/2cr5c6W/Illustration05.jpg"
let text = "Please Register yourself"

const companySchema = new Schema({
Type: String,
name: String,
logo: String,
about: String,
});






const CompanyModel = new model("name",companySchema);
const types=["Marquee Company","Super Dream Company","Dream Company","Day Sharing"];
const question_type = ["Multiple Choice","Coding Questions"]
const test_images = ["https://media.istockphoto.com/id/1184801139/vector/online-testing-e-learning-education-concept-people-are-studying-the-application-form-vector.jpg?s=612x612&w=0&k=20&c=l2QTjm2VueMmbkG4Q34nqtem3t4N4ECO_Wo7jPfKaFY=","https://img.freepik.com/free-vector/software-code-testing-concept-illustration_114360-8174.jpg?w=2000"]
const images = [marquee,super_dream,dream,Day];
list=[];
let entry=0


const profileSchema = new Schema({
    Name: String,
    Email: String,
    Password: String,
});

const profileModel = new model("profile",profileSchema)



const questionSchema = new Schema({
  numbers : Number,
  question : String,
  option1 : String,
  option2 : String,
  option3 : String,
  option4 : String,
  answer : String,
});
const questionModel = new model("question",questionSchema)


app.get("/login",function(req,res){
res.render("login.ejs")
});


app.post("/login", async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await profileModel.findOne({Email: email, Password: password});
        if(user) {
          req.session.user = user; // Set the user object in the session
          res.redirect('/');
        } else {
            res.render("register",{msg:"please register before you login or check credentials"})
          // Do something else if user not found, such as redirect to login page
        }
      } catch (err) {
        console.log(err);
      }
      
});

app.get('/',requireLogin,function(req,res){
  res.render("home.ejs",{types:types,images:images});
});

app.get("/register",function(req,res){
   res.render("register",{msg:text})
});
app.post("/register", async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const user = await profileModel.create({ Name: name, Email: email, Password: password });
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send("Failed to register user");
    }
  });
  





app.get("/companies/:types",requireLogin,async(req,res)=>{
    list=[]
    title = req.params.types;
    const result = await CompanyModel.find() // Make sure to wrap this code in an async function
    result.forEach(element => {
        if(element.Type==title)
         list.push({name:element.name,logo:element.logo,about:element.about})
    });
    res.render("companyPage.ejs",{companies:list,title:title})
});

app.get("/tests/:company",requireLogin,async(req,res)=>{
    title=req.params.company
    res.render("Tests.ejs",{types:question_type,images:test_images,title:title})
})


app.get("/test/mcq",async(req,res)=>{
  list=[]
  title = req.params.company;
  const result = await questionModel.find() // Make sure to wrap this code in an async function
  result.forEach(element => {
       list.push({number:element.numbers,text:element.question,option1:element.option1,option2:element.option2,option3:element.option3,option4:element.option4})
  });
  res.render("mcq.ejs",{questions:list})
})
app.get('/signout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

port = 3000;
app.listen(port,function(){
   console.log("server is running in port"+port)
})

