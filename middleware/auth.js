const {User} =require('../models/User')
let auth = (req,res,next) =>{
// 인증처리를 하는곳

// 클라이언트 쿠키에서 토큰 가져온다.
let token =req.cookies.x_auth;


// 토큰을 복호화 한 후 유저를 찾는다.
User.findByToken(token)
.then(user => {
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
})
.catch(err => {
    return res.status(400).send(err);
});
//유저가 있으면 인증 okay


}
module.exports ={auth}