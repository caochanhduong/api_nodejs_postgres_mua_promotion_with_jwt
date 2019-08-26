const Pool = require('pg').Pool
const getDateArray=require('../utils/utils').getDateArray
const isValidate=require('../utils/utils').isValidDate
const comparePassword=require('../utils/utils').comparePassword
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dataextract',
  password: 'root',
  port: 5432,
})


const register = function(req, res) {
    var username = req.body.username
    var hash_password = bcrypt.hashSync(req.body.password, 10);
    pool.query("select * from users where username=$1;",[username],(err,results)=>{
        if (err){
            return res.status(500).json({
                "status":"error",
                "message":err,
                "code":500
              })
             
        }
        if (results.rows.length>0){
            // console.log(typeof results.rows)
            return res.status(401).json({
                "status":"error",
                "message":"User has already existed! Please try another username!",
                "code":401
              })
        }
        else{
            pool.query("insert into users values ($1,$2,current_timestamp);",[username,hash_password],(err,results)=>{
                
                if (err){
                    return res.status(500).json({
                        "status":"error",
                        "message":err,
                        "code":500
                      })
                     
                }
                else{
                    return res.status(200).json({
                        "status":"OK",
                        "message":"Register success!",
                        "code":200
                      })
                }
            })
        }
    })
};

const sign_in = function(req, res) {
    var username = req.body.username
    var password = req.body.password
    pool.query("select * from users where username=$1;",[username],(err,results)=>{
        if (results.rows.length==0){
            return res.status(401).json({
                "status":"error",
                "message":"Authentication failed! User not found!",
                "code":401
              })
        }
        else{
            if (!comparePassword(results.rows[0].password,password))
                return res.status(401).json({
                    "status":"error",
                    "message":"Authentication failed! Wrong password!",
                    "code":401
                })
            else
                return res.json({token: jwt.sign({ username: username, password : password}, 'RESTFULAPIs')});  
        }
    })
};

const loginRequired = function(req, res, next) {
    if (req.user) {
        next();
      } else {
        return res.status(401).json({
            "status":"error",
            "message":"Unauthorized user!",
            "code":401
          })
      }
};


module.exports={
    register,
    sign_in,
    loginRequired
}