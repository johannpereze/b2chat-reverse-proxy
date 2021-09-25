const { default: axios } = require("axios");
const express = require("express");
const { response, request } = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();

//Configuración de CORS
app.use(
  cors({
    origin: "*",
  })
);

//Lectura y parseo del body
app.use(express.json())

const port = process.env.PORT;
const LOGIN_HASH = process.env.LOGIN_HASH;

//ENDPOINTS

//Endpoint para obtener el token temporal de b2chat
app.post("/oauth/token", (req = request, res = response) => {

  var config = {
    method: "post",
    url: "https://api.b2chat.io/oauth/token?grant_type=client_credentials",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${LOGIN_HASH}`,
    },
  };

  axios(config)
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Endpoint para enviar un mensaje
app.post("/broadcast", (req = request, res = response) => {

  const b2ChatToken = req.headers.authorization   //headers.lazyUpdate
  console.log(b2ChatToken);//aquí debo imprimir lo que venga en el body
  console.log(req.body);
  const body = req.body;
  

  var data = JSON.stringify(body);
  
  var config = {
    method: 'post',
    url: 'https://api.b2chat.io/broadcast',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': b2ChatToken
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(response.data);
    res.json(response.data); //no me estaba enviando esta respuesta a la consola del navegador porque fakyaba el .data. Tiraba este error: TypeError: Converting circular structure to JSON
  })
  .catch(function (error) {
    console.log(error);
  });
});


//Listener
app.listen(port, () => {
  console.log(`Listenin on port http://localhost:${port}`);
});
