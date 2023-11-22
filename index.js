const express = require('express') //익스프레스 모듈 갖고오고
const app = express() //새로운 앱만들고
const port = 5000 //포트
const bodyParser = require('body-parser')

const config = require('./config/key')
const {User} = require('./models/User')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
  useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false
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
app.post('/register', async (req, res) => {
  const user = new User(req.body);

  try {
    const doc = await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.json({ success: false, err });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})