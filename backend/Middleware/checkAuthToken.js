const jwt = require('jsonwebtoken')

function checkAuth(req,res,next){
    const authToken = req.cookies.authToken
    const refreshToken = req.cookies.refreshToken
    console.log("Check Auth Middleware called !!")

    if(!authToken && !refreshToken){
        return res.status(401).json({
            message: "Authentication failed : Tokens expired !!"
        })
    }

    jwt.verify(authToken, process.env.JWT_AUTH_KEY,(err,decoded)=>{
        if(err){
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY,(ref_err,ref_decoded)=>{
                if(ref_err){
                    return res.status(401).json({
                        message: "Authentication failed : Both tokens are invalid"
                    })
                }
                else{
                    const authToken = jwt.sign({userId: ref_decoded.userId},process.env.JWT_AUTH_KEY,{expiresIn:'10m'})
                    const refreshToken = jwt.sign({userId: ref_decoded.userId},process.env.JWT_REFRESH_KEY,{expiresIn:'30m'})
                    res.cookie('authToken',authToken,{httpOnly:true})
                    res.cookie('refreshToken',refreshToken,{httpOnly:true})
                    req.userId = ref_decoded.userId
                    next()
                }
            })
        }
        else{
            req.userId = decoded.userId
            next()
        }
    })
    
}

module.exports = checkAuth