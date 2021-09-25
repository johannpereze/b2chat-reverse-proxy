const express = require('express')
const app = express()
require('dotenv').config()
//env

const port = process.env.PORT
 
app.get(':endpoint([\\/\\w\\.-]*)', (req, res)=> { //Con esta expresión regular, no importa que ruta envíen siempre y cuando sea una ruta válida
  res.send('Hello proxy')
})
 
app.listen(port, ()=>{
    console.log(`Listenin on port http://localhost:${port}`);
}) 

