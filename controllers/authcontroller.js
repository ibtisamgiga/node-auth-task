const User=require('../model/User')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

  /*************************CREATE TOKEN******************/
const maxAge=3*24*60*60;
  const createToken=(id)=>{
    return jwt.sign({id},'my secret',{
        expiresIn:maxAge
    })

  }


  /******************************************************/

const signup_get=(req,res)=>{
    res.render('signup')
}


const login_get=(req,res)=>{
    res.render('login')
}


const signup_post=async(req,res)=>{
try{
    const{email,password} =req.body
    const user=new User(req.body)
    const result=await user.save()
    const token=createToken(result._id)
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
    res.status(201).json({user:result._id})
    console.log(result)
}
catch(err){
    const errors = handleErrors(err);
    res.status(400).json({ errors });

}
  
}



const login_post=async(req,res)=>{
    const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token=createToken(user._id)
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
    //res.status(400).json({});
  }
}

const logout_get=async (req,res)=>{
res.cookie('jwt','',{maxAge:1});
res.redirect('/')
}
module.exports={
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get

}