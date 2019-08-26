const Pool = require('pg').Pool
const getDateArray=require('../utils/utils').getDateArray
const isValidate=require('../utils/utils').isValidDate
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dataextract',
  password: 'root',
  port: 5432,
})


const getResultLogin = (request, response) => {
  const serverId = request.query.serverId
  const roleId=request.query.roleId
  const fromDs=request.query.startDate
  const toDs=request.query.endDate
  const startDate = new Date(fromDs); //YYYY-MM-DD
  const endDate = new Date(toDs); //YYYY-MM-DD
  const dateArr=getDateArray(startDate,endDate)
  var result=[]

  if (!(isValidate(fromDs)&&isValidate(toDs))){
    return response.status(400).json({
      "status":"error",
      "message":"Input Error! startDate and endDate must be valid dates",
      "code":400
    })
  }

  if (fromDs>toDs)
    return response.status(400).json({
      "status":"error",
      "message":"Input Error! endDate must be greater than or equal to startDate",
      "code":400
    })

  pool.query('select ds,count(*) from playerlogin where server_id=$1 and role_id=$2 and ds>=$3 and ds <=$4 group by ds;',[serverId,roleId,fromDs,toDs] ,(error, results) => {
    if (error) {
      return response.status(500).json({
        "status":"error",
        "message":"Error executing query",
        "code":500
      })
    }

    // console.log(results.rows)
    for (let i=0;i<dateArr.length;i++)
    {
      const found = results.rows.some(element => element.ds == dateArr[i]);
    
      if (found) 
        result.push({
          date:dateArr[i],
          isLogin:true
        })
      else
        result.push({
          date:dateArr[i],
          isLogin:false
        })
    }

    return response.status(200).json({
      "status":"OK",
      "message":result,
      "code":200
    })
  })
}

const getResultCombatforce = (request, response) => {
  const serverId = request.query.serverId
  const roleId=request.query.roleId
  const fromDs=request.query.startDate
  const toDs=request.query.endDate
//   console.log(serverId)
  const startDate = new Date(fromDs); //YYYY-MM-DD
  const endDate = new Date(toDs); //YYYY-MM-DD
  const dateArr=getDateArray(startDate,endDate)
  var result=[]

  if (!(isValidate(fromDs)&&isValidate(toDs))){
    return response.status(400).json({
      "status":"error",
      "message":"Input Error! startDate and endDate must be correct dates",
      "code":400
    })
  }

  if (fromDs>toDs)
    return response.status(400).json({
      "status":"error",
      "message":"Input Error! endDate must be greater than or equal to startDate",
      "code":400
    })

  pool.query('select ds,combat_force from (select max(log_date) as max_log_date from playerlogin where server_id=$1 and role_id=$2 and ds>=$3 and ds <= $4 group by ds ) a left outer join (select combat_force,log_date,ds from playerlogin where server_id=$1 and role_id=$2 and ds>=$3 and ds <=$4) b on a.max_log_date=b.log_date ;',[serverId,roleId,fromDs,toDs] ,(error, results) => {
    if (error) {
      return response.status(500).json({
        "status":"error",
        "message":"Error executing query",
        "code":500
      })
    }

    // console.log(results.rows)
    // console.log(Number.MAX_SAFE_INTEGER)
    for (let i=0;i<dateArr.length;i++)
    {
      const found = results.rows.find(element => element.ds == dateArr[i]);

      if (found) 
        result.push({
          date:dateArr[i],
          combat_force: parseInt(found.combat_force)
        })
        
      else
        result.push({
          date:dateArr[i],
          combat_force:0
        })
    }

    return response.status(200).json({
      "status":"OK",
      "message":result,
      "code":200
    })
  })
}

module.exports = {
  getResultLogin,
  getResultCombatforce
}