const express = require("express"),
      mongoose = require("mongoose"),
      cors = require("cors"),
      path = require("path"),
      port = 3001,
      jwt = require("jsonwebtoken"),
      bodyParser = require("body-parser"),
      app = express();
require("dotenv").config();

app.use(express.static(path.join((__dirname + "/build"))));
const urlDb = process.env.DB_URL,
      secret = process.env.TOKEN_SECRET;

const User = require("./user");
async function getUser(t, s){
  let decoded = jwt.verify(t, s),
      user = await User.findOne({
       _id: decoded._id
      });
      return [user, decoded];
}

function returnData(u){
  return{
      name: u.name,
      email: u.email,
      date: u.date,
      vacations: u.vacations
  };
}
(async () => {
    try{
      await mongoose.connect(urlDb, {
        useNewUrlParser: true
      });
    } catch(err){
      console.log(err);
    }
})();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.post("/", async (req, res) => {
  const user = await User.findOne({
    name: req.body.login,
    password: req.body.pass
  });
  if(!user) return res.status(400).json("User not found");
  const token = jwt.sign({_id: user._id}, secret);
  res.send(JSON.stringify({
    token: token,
    user: returnData(user)
  }));
});

app.get("/auth", async (req, res) => {
  const token = req.headers["auth-token"];
  let decoded, user;
  try{
    [user] = await getUser(token, secret);
  }catch(err){
    res.status(400).end();
  }
  res.json({user:returnData(user)});
});

app.post("/signup", async (req, res) => {
  if(await User.findOne({
      name:req.body.login
    })){
      res.status(400).json("err");
    }else{
      let user = new User({
        name: req.body.login,
        email: req.body.email,
        password: req.body.pass,
        date: req.body.date,
        vacations:[]

      });
      user.save();
      res.json("ok");
    }
});

app.put("/edit", async (req, res) => {
  const token = req.headers["auth-token"];
  let decoded, user;
  try{
    [user, decoded] = await getUser(token, secret);
    user.vacations[req.body.index] = req.body.vacation;
    await User.updateOne({_id: decoded._id}, user);
    user = await User.findOne({
     _id: decoded._id
    });
    res.json({user:returnData(user)});
  }catch(err){
    console.log(err);
  }
});

app.put("/addvacation", async (req, res) => {
  const token = req.headers["auth-token"];
  let decoded, user;
  try{
    [user, decoded] = await getUser(token, secret);
     user.vacations.push(req.body.vacation);

     await User.updateOne({_id: decoded._id}, user);
     user = await User.findOne({
      _id: decoded._id
     });
    res.json({user:returnData(user)});

  }catch(err){
    console.log(err);
    res.status(400).end();
  }

});
app.delete("/deletevaction", async (req, res)=>{
  let token = req.headers["auth-token"];
  let decoded, user;
  try{
    [user, decoded] = await getUser(token, secret);
    user.vacations.splice(req.body.index, 1);
    await User.updateOne({_id: decoded._id}, user);
    user = await User.findOne({_id: decoded._id});
    res.json({user:returnData(user)});
  }catch(err){
    console.log(err);
  }
});

app.listen(port, err => {
  if(err){
    console.log("error " + error);
  }else console.log("server has been started...");
});
