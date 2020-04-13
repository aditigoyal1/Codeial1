const User=require("../models/user");


module.exports.profile=function(req,res)
{
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:"user profile",
            profile_user:user
        });

    })
    
}

module.exports.update=function(req,res)
{
    if(req.user.id==req.params.id)
    {
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            req.flash('success','User info Updated');
            return res.redirect('back');
        })
    }
    else{
        req.flash('error', 'Unauthorized!');
        res.status(401).send("Unauthorized");
    }
}

module.exports.signUp=function(req,res)
{
   if(req.isAuthenticated()){
       return res.redirect('/users/profile');
   }
    return res.render('user_sign_up',{
        title:"Codeial| Sign Up",
    })
}

module.exports.signIn=function(req,res)
{
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"Codeial| Sign In",
    })
}


module.exports.create=function(req,res)
{
    if(req.body.password!=req.body.confirm_password)
    {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');

    }

    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("Error in finding the User in Signning Up");
            return;
             }

         if(!user)
         {
             User.create(req.body, function(err,user){
                 if(err)
                 {
                     console.log('Error in creating the User');
                     return;
                 }

                 return res.redirect('/users/sign-in');
             })
         }else{
            req.flash('success', 'You have signed up, login to continue!');
             return res.redirect('back');
         }   
        

    });


}

module.exports.createSession=function(req,res)
{
    req.flash('success','Logged in Successfully');

    return res.redirect('/');
}

module.exports.destroySession=function(req,res)
{
    req.logout();
    req.flash('success','Logged out Successfully');

    return res.redirect('/');
}
