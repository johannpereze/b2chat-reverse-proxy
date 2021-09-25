const { default: axios } = require("axios");
const express = require("express");
const { response, request } = require("express");
const cors = require('cors');

const app = express();
require("dotenv").config();

app.use(cors({
  origin:'*'
}))

// const API_ENDPOINT = process.env.API_ENDPOINT; //Creo que esto no me sirve como variable de entorno porque lo voy a hacer específico para b2chat y no necesito cambiarlo luego

const port = 8084; //process.env.PORT;
const LOGIN_HASH = process.env.LOGIN_HASH

//Podría hacer 2 endpoints. Uno de autenticación y otro de broadcast

app.get("/oauth/token", (req = request, res = response) => {

//código de postman
  var config = {
    method: 'post',
    url: 'https://api.b2chat.io/oauth/token?grant_type=client_credentials',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': `Basic ${LOGIN_HASH}`
    }
  };


//Este es el codigo viejo
  // axios
  //   .get("https://pokeapi.co/api/v2/pokemon-species/4/") //aquí me falta pegarle el grant type. PONERLE POST. la ur real sería https://api.b2chat.io/oauth/token


  axios(config)
    .then((response) => {
      res.json(response.data)
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Listenin on port http://localhost:${port}`);
});
