const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const nodeMailer = require('nodemailer');
const dotenv =require('dotenv');

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
dotenv.config();


//an array that will store all the checked items in list
var senddata=[];

//connecting to our mongoDb server at atlas
mongoose.connect("mongodb+srv://PankajCrud:<password>@cluster0.m6vkv3c.mongodb.net/UsersDB")

//the structure in which our data will be stored in mongodb database
const listschema={
  name:String,
  phone:Number,
  email:String,
  hobbies:String
};

const List = mongoose.model("List",listschema);

app.get("/",function(req,res){
  res.render("index");
});

app.get("/table",function(req,res){
  List.find(function(err,items){
    if(err){
      console.log(err);
    }else{
      console.log("rendering the list");
    }
    res.render("list",{newlistitems:items});
  });
});

//when we hit save button then we insert that data in database
app.post("/",function(req,res){
  console.log(req.body);
  const listitem=new List({
    name:req.body.name,
    phone:req.body.phone,
    email:req.body.email,
    hobbies:req.body.hobbies
  });

  listitem.save();
  res.redirect("/table");
});

//when we want to update the existing user details
app.post("/updateitem",function(req,res){
  List.findOneAndUpdate({_id:req.body.updateid},{$set:{name:req.body.name,phone:req.body.phone,email:req.body.email,hobbies:req.body.hobbies}},function(err,found){
    if(err){
      console.log(err);
    }else{
      res.redirect("/table");
    }
  });
});

//this will show the all users list when click on all users table button
app.post("/showtable",function(req,res){
  res.redirect("/table");
});


//when we check the item we find that item in database and push it in senddata array
app.post("/checkbox",function(req,res){
  console.log(req.body);
   List.findOne({_id:req.body.checkbox},function(err,found){
     if(err){
       console.log(err);
     }else{
       senddata.push(found);
     }
   });
});

//when we add button to add more Users
app.post("/add",function(req,res){
  res.redirect("/");
});


//when we click on send mail this will send all the data in senddata array using nodeMailer
 app.post("/send",function(req,res){
   let testAccount = nodeMailer.createTestAccount();
   console.log(process.env.user);
   console.log(process.env.pass);
   let transporter = nodeMailer.createTransport({
           host: 'smtp.gmail.com',
           port: 465,
           secure: true,
           auth: {
               user: process.env.user,
               pass: process.env.pass
           }
       });
       var content = senddata.reduce(function(a, b) {
         return a + '<tr><td>' + b.name + '</a></td><td>' + b.phone + '</td><td>' + b.email + '</td><td>' + b.hobbies + '</td></tr>';
       }, '');
       console.log(content);
       senddata=[];
       let mailOptions = {
           from: '"Pankaj" <pankajpcm111@gmail.com>', // sender address
           to: '<info@redpositive.in>', // list of receivers
           subject: 'Selected Users Data', // Subject line
           text: 'hello', // plain text body
           html: '<div><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Hobbies</th></tr></thead><tbody>' + content + '</tbody></table></div>'// html body
       };

       transporter.sendMail(mailOptions, (error, info) => {
           if (error) {
               return console.log(error);
           }
           console.log('Message %s sent: %s', info.messageId, info.response);
               res.redirect("/table");
           });
 });


//when we click on update button we will be rendered to update page with all the information pre filled and we can edit what we want to
//and click on update to update
app.post("/update",function(req,res){
  const itemid=req.body.update;
  console.log(itemid);
  List.findOne({_id:itemid},function(err,founded){
    if(err){
      console.log(err);
    }else{
      console.log("element item founded");
      console.log(founded);
    res.render("update",{item:founded});
    }
  });
});


//this will remove the user from list and delete it from the database as well
app.post("/delete",function(req,res){
  const itemid=req.body.delete;
  console.log(itemid);
  List.deleteOne({_id:itemid},function(err,deleted){
    if(err){
      console.log(err);
    }else{
      console.log("deleted item from list");
        res.redirect("/table");
    }
  });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port,function(){
  console.log("server running at port 3000");
})
