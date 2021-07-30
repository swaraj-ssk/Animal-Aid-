//jshint esversion:6
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require("request");
const nodemailer = require('nodemailer');
const router = express.Router();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req,res){

  res.render("home");

});

app.get("/home", function(req,res){

  res.render("home");

});

app.get("/about", function(req,res){
  res.render("about");
});

app.get("/join", function(req,res){
  const str = "Join Us to become our member.";
  res.render("join",{Succfail:str});

});

app.get("/donate", function(req,res){
  res.render("donate");

});

app.get("/contact", function(req,res){
  const msg = "status";
  res.render("contact",{Status: msg});
});

// 1e0aed20b7d705708a2e1cbde6b6bee9-us6 : API key
// a709c57e81 : List id

// Newsletter subscription

app.post("/join",function(req,res){
  const firstName = req.body.top;
  const lastName = req.body.middle;
  const email = req.body.bottom;


  const data = {
    members : [{
        email_address: email,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/70bac0537b" ;

  const options = {
    url:"https://us6.api.mailchimp.com/3.0/lists/70bac0537b" ,
    method: "POST",
    headers:{
      Authorization: 'auth 6a962063092c7457a85ede73edfb5527-us6'
    },
    // auth: "Swaraj2001:6a962063092c7457a85ede73edfb5527-us6" ,
    body: jsonData
  }

  const succ = "Success ! Congrats you became our member.We will contact you on email soon." ;
  const fail = "Oops! You failed to join. Please retry." ;

 request(options,(err,response,body)=>{
    if(err){
      res.render("join",{Succfail:fail});
    }else{
      if(response.statusCode === 200){
        res.render("join",{Succfail:succ});
      }else {
        res.render("join",{Succfail:fail});
      }
    }
});
});

// contact

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.post('/contact',(req, res) => {

    var email = req.body.bottom;
    let password = req.body.Password;
    let firstName = req.body.top ;
    let lastName = req.body.middle ;
    let message = req.body.message;

    var emailMessage = `Hi ${firstName} ${lastName},\n\nThank you for contacting us.\n\nYour email is: ${email}.\n\nYour enquiry is: ${message}\n.`;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
        user: '__email__',
        pass: '__password__'
      }
      // ,
      //   tls: {
      //       rejectUnauthorized: false
      //   }
    });

    let messageOptions = {
        from: 'User __email__',
        to: email,
        text: emailMessage
    };

    transporter.sendMail(messageOptions, (error, info) => {
        if (error) {
          let a = "Error, please try again."
          res.render("contact",{ Status:a});
          return console.log(error);
        }else{
          let b = "Email received"
          res.render("contact",{ Status:b});
          console.log('Message %s sent: %s', info.messageId, info.response);
        }

    });
});

module.exports = router ;


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
