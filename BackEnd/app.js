const express = require("express") ; 
const mongoose = require("mongoose") ; 
const _ = require("lodash") ; 
const jwt = require('jsonwebtoken');

const cors = require("cors") ;  
const User = require("./models/user") ;  
const multer = require('multer') ; 
const url = "mongodb+srv://ranim:Ranim1234@cluster0.sfqsc.mongodb.net/users?retryWrites=true&w=majority" ;  
const app = express() ; 
const { check, validationResult, body } = require('express-validator') ; 

mongoose.connect(url,{useNewUrlParser:true ,useCreateIndex:true, useUnifiedTopology:true}) 
.then(()=>{
    console.log("connected");
}) 
.catch((err)=>{
console.log(err) ; 
})
app.listen(8000) ; 
app.use(cors()) ;  
app.use(express.json()) ; 
app.use(express.static('public')) ;  
app.use(express.urlencoded({extended:false})) ; 
app.set('view engine','ejs') ;  
const userValidationRules = () => {
    return [
      // password must be at least 5 chars long
      body('password').isLength({ min: 5 }),
      
       body('username').not().isEmpty().withMessage('Enter username'),
        body('nom').not().isEmpty(),
        body('description_competences', 'cv','niveau','specialite').optional(),
        body('email', 'Your email is not valid').isEmail(),
     
    ]
  }
  
  const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
  }
const storage = multer.diskStorage({
    destination: function(request,file,callback){
        callback(null,'./public/uploads/files') ; 
    } , 
    filename: function(request,file,callback){
        callback(null,Date.now() + file.originalname) ; 
    },
});
const upload = multer({
    storage:storage, 
    limits:{
        filedSize:1024*1024*3*3,
    },
}) ; 
// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',+
        'x-access-token, x-refresh-token'
    );

    next();
});


let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            res.status(401).send(err);
        } else {
            req.user_id = decoded._id;
            next();
        }
    });
}
let verifySession = (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');

    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }



        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}
//app.get('/',(req,res)=>{
   // res.send("hello") ; 
//})
// file same name input 
app.post('/users',upload.single('cv'), userValidationRules(),validate,  (req, res) => {
    // User sign up
    const nom = req.body.nom ; 
    const username = req.body.username; 
    const email = req.body.email ; 
    const password = req.body.password; 
    const nom_faculte = req.body.nom_faculte ; 
    const specialite = req.body.specialite ; 
    const niveau = req.body.niveau ; 
    const description_competences = req.body.description_competences ; 
    
    const newUser = new User({nom:nom,username:username,email:email,password:password,nom_faculte:nom_faculte,specialite:specialite,niveau:niveau,description_competences:description_competences});
console.log(newUser.email); 
console.log(newUser.password) ; 
    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
 

        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
   
})



//user_login 
app.post('/users/login',(req, res) => {
    let username= req.body.username; 
    let password = req.body.password;

    User.findByCredentials(username, password).then((user) => {
        return user.createSession().then((refreshToken) => {
           

            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

//get User by id 

app.get("/user/:id",(req,res)=>{

const id = req.params.id ; 
User.findOne({_id:id}).then((user)=>{
res.send(user) ; 


})
.catch((err)=>{

    console.log(err) ; 
})



})
app.patch('/users/:id', authenticate,(req,res)=>{
/*const id = req.params._id ;  
const user = {
     nom :req.body.nom ,
    username: req.body.username  ,
     email : req.body.email ,
     password : req.body.password , 
     nom_faculte : req.body.nom_faculte , 
    specialite: req.body.specialite , 
     niveau : req.body.niveau , 
     description_competences : req.body.description_competences  
}*/
const  updateObject = req.body;
const id = req.params.id;
User.updateOne({_id  : id}, {$set: updateObject}).then(()=>{res.send("updated succesfully") ; 
})
  
   // console.log(doc) 
   .catch((err)=>{

    console.log(err) ; 
})

}) 
app.post('/user/:id',authenticate, (req,res)=>{
    const id = req.params.id ; 
    User.findByIdAndUpdate(id, req.body, function (err, user) {
        if (err) {
          return next(err);
        } else {
          user.password = req.body.new_password;
          user.save(function (err, user) {
            if (err) {
              res.send("Error: ", err); 
            } else {
              res.send("password updated successfully!");
            }
          })
        }
      });
})
app.delete('/users/:id',upload.single('cv'), authenticate,(req,res)=>{

const id = req.params._id ; 
User.deleteOne(id).then((doc)=>{
res.send(doc) ; 

}).catch((err)=>{

console.log(err) ; 

})


}) 
// statics 
app.get('/',(req,res)=>{
User.aggregate([{
    $count: "nombre d'inscris dans notre site"
  }]).then((data)=>{res.send(data);})
.catch((err)=>{console.log(err);})
})

//nombre d'annonces 
//app.get('/',(req,res)=>{
  //  Annonce.aggregate([{
     //   $count: "nombre d'annonces  dans notre site"
     // }]).then((data)=>{res.send(data);})
    //.catch((err)=>{console.log(err);})
   // })
    
 //nombre d'entreprises 
//app.get('/',(req,res)=>{
  //  Entreprise.aggregate([{
     //   $count: "nombre d'entreprises  dans notre site"
     // }]).then((data)=>{res.send(data);})
    //.catch((err)=>{console.log(err);})
   // })   

   //nombre d'entreprises par domaine 
  // app.get('/',(req,res)=>{
   // Entreprise.aggregate([
        
        
         // {$group:{_id:"$domaine",
       // count:{$sum:1}}}


          
    
        
  // ]).then((data)=>{res.send(data);})
//.catch((err)=>{console.log(err);})


  // }) 
   // nombre d'offre par domaine 
   // app.get('/',(req,res)=>{
   // Annonce.aggregate([
        
        
         // {$group:{_id:"$domaine",
       // count:{$sum:1}}}


          
    
        
  // ]).then((data)=>{res.send(data);})
//.catch((err)=>{console.log(err);})
// create annonce 
/*app.post('/users/:id/', authenticate,(req,res)=>{
const nom = req.body.nom ; 
const description = req.body.description ; 
const durée = req.body.durée ; 
const nombres_stagiaires = req.body.nombres_stagiaires ; 
const new_annonce = new Annonce({nom:nom,description:description,durée:durée,nombres_stagiaires:nombres_stagiaires}) ; 
new_annonce.save().then((result)=>{console.log(result);}) 
.catch((err)=>{console.log(err);})

}) */

/*app.post('/users/:_id/:id_annonce', authenticate,(req,res)=>{

const date = req.body.date ; 
const _id = req.body._id ; 
const id_annonce = req.body.id_annonce ; 


const newCondidature = new Condidature({date:date,}) 
newCondidature.save().then((newCondidature)=>{res.send(newCondidature);
newCondidature.add(_id,id_annonce) ; 
})
.catch((err)=>{console.log(err);}) 


})  
 //app.post('/users/:id/:id_annonce/stagiaire',(req,res)=>{


    //const newCondidature_stagiare = new Condidature_stagiaire() ; 
    //newCondidature_stagiare.save().then((newCondidature_stagiare)=>{
       // res.send(newCondidature_stagiare); 
   // }).catch((err)=>{console.log(err);}) 
    
//})  
// find users who apply 
app.get('/entreprise/:annonce_id', authenticate,(req,res)=>{
const annonce_id = req.params.annonce_id ; 
Annonce.find({_id:annonce_id}).then((doc)=>{

res.send(doc) ; 

}).catch((err)=>{console.log(err);})
}) 

// find all condidatures for user 
app.get('/',(req,res)=>{
const user_id = req.params.user_id ; 
User.find({_id:user_id}).then((user)=>{
    res.send(user) ; 
})
.catch((err)=>{console.log(err);})


}) */ 
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
    
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
        console.log(e);
    });
})
