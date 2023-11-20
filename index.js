const express = require('express') //익스프레스 모듈 갖고오고
const app = express() //새로운 앱만들고
const port = 3000 //포트
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://test:12341234@boilerplate.c2oszcx.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('연결완료')
})
.catch(err =>{
    console.log(err)
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})