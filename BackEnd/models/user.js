const express = require('express') ; 
const mongoose = require('mongoose') ; 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken') ;  
const _ = require('lodash');
const crypto = require('crypto');

const schema = mongoose.Schema ;  

// JWT Secret
const jwtSecret = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

const UserSchema = new schema({

    nom : {
           type: String 

    } , 
    username: {
        type: String ,
        unique:true

 } , 

    email: {
        type: String,
        unique:true
       
    },
    password: {
        type: String
    },
    nom_faculte:{
        type:String
    },
    specialite:{
        type:String
    },
    niveau:{
        type:String
    },
    description_competences:{
        type:String
    },
    cv:{
type: String
    },
    photo:{
        type:String
    },
    sessions: [{
        token: {
            type: String
           
        },
        expiresAt: {
            type: Number
        }
    }]
}, {timestamps: true});


// *** Instance methods ***

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject();
            }
        })
    })
}
UserSchema.statics.getJWTSecret = () => {
    return jwtSecret;
}

UserSchema.methods.generateRefreshAuthToken = function () {
    // This method simply generates a 64byte hex string - it doesn't save it to the database. saveSessionToDatabase() does that.
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                // no error
                let token = buf.toString('hex');

                return resolve(token);
            }
        })
    })
}

UserSchema.methods.createSession = function () {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject('Failed to save session to database.\n' + e);
    })
}



/* MODEL METHODS  */

UserSchema.statics.getJWTSecret = () => {
    return jwtSecret;
}



UserSchema.statics.findByIdAndToken = function (_id, token) {

    const User = this;

    return User.findOne({
        _id,
        'sessions.token': token
    });
}


UserSchema.statics.findByCredentials = function (username, password) {
    let User = this;
    return User.findOne({ username }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                    console.log(user); 
                }
                else {
                    reject();
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if (expiresAt > secondsSinceEpoch) {
        return false;
    } else {
        return true;
    }
}


/* MIDDLEWARE */
UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    if (user.isModified('password')) {

        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});


/* HELPER METHODS */
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({ 'token': refreshToken, expiresAt });

        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);

module.exports = User  ; 