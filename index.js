const express = require('express') //익스프레스 모듈 갖고오고
const app = express() //새로운 앱만들고
const port = 5000 //포트
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')
const {User} = require('./models/User')
const {auth} = require('./middleware/auth')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(()=>{
    console.log('연결완료')
})
.catch(err =>{
    console.log(err)
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/register', async (req, res) => {
  const user = new User(req.body);

  try {
    const doc = await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err); // 오류 로깅

    res.json({ success: false, err });
  }
});
app.post('/api/users/login', async (req, res) => {
  try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
          return res.json({
              loginSuccess: false,
              message: "제공된 이메일에 해당하는 유저가 없습니다."
          });
      }

      user.comparePassword(req.body.password, async (err, isMatch) => {
          if (err) return res.status(400).send(err);
          if (!isMatch) {
              return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
          }

          try {
              const tokenUser = await user.generateToken();
              res.cookie("x_auth", tokenUser.token)
                 .status(200)
                 .json({ loginSuccess: true, userId: user._id });
          } catch (error) {
              res.status(400).send(error);
          }
      });
  } catch (error) {
      res.status(500).json({ success: false, error });
  }
});

app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 것은 Authentication 이 True 라는 것
  res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role !== 0,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
  });
});
// auth 미들웨어를 사용하는 이유는 req.user 데이터를 사용하기 위함
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
      .then(user => {
          if (!user) return res.json({ success: false, error: "User not found" });
          return res.status(200).send({ success: true });
      })
      .catch(err => {
          return res.json({ success: false, err });
      });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})