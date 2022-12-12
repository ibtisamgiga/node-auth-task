const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const{isEmail}=require('validator')
const bcrypt=require('bcrypt')


const userSchema=new Schema({
email:{type:String,
    required:[true,'email is mandatory'],
    unique:true,
    lowecase:true,
    validate:[isEmail,'Please enter valid email']

},

password:{type:String,
    required:true,
    minlength:[6,'valid password must be 6 char']
},



},{timestamps:true});

/// fire a functio after some event occur 
/*
userSchema.post('save',(doc,next)=>{
console.log('new user created',doc);
next()
})*/
///fire a function before some event occur
/// fire a functio after some event occur 
userSchema.pre('save',async function (next){
    console.log('new user created about to be created',this);
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt)
    next()
    })

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };




const User=mongoose.model('user',userSchema)

module.exports=User