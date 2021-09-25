const express = require('express')
const app = express()

const port = process.env.PORT
 
app.get('/', (req, res)=> {
  res.send('Hello proxy')
})
 
app.listen(port, ()=>{
    console.log(`Listenin on port http://localhost:${port}`);
}) 

