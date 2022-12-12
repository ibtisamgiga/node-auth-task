const express = require('express');
const mongoose = require('mongoose');
const authRoutes=require('./routes/authRoutes')
const cookieParser=require('cookie-parser')
const{requireAuth, checkUser}=require('./middleware/authmiddleware')
const app = express();

// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())


// database connection
const dbURI = 'mongodb+srv://nodeauth:Abcd@auth-project.s8vdann.mongodb.net/auth-project';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {app.listen(3000)
    console.log('db connected')
  
  })
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser)
app.get('/', requireAuth,(req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes)

/*************************************************COOKIES****************************************/
/*
app.get('/set-cookies',(req,res)=>{

  //res.setHeader('set-cookies','newUser=true')
  res.cookie('newUser',false)
  res.cookie('isEmployee',true,{maxAge:1000*60*60*24,/*secure:true,httpOnly:true})
  res.send('you got the cookie')

})


app.get('/read-cookies',(req,res)=>{
  const cookies=req.cookies
  console.log(cookies)
  res.json(cookies)
  
  
})*/

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});


