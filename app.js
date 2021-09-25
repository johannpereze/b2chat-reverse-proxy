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

//Podría hacer 2 endpoints. Uno de autenticación y otro de broadcast

app.get("/oauth/token", (req = request, res = response) => {
  //Con esta expresión regular, no importa que ruta envíen siempre y cuando sea una ruta válida :endpoint([\\/\\w\\.-]*)
  // res.send("Hello world");

  const { grant_type = "client_credentials" } = req.query;
  axios
    .get("https://pokeapi.co/api/v2/pokemon-species/4/") //aquí me falta pegarle el grant type. la ur real sería https://api.b2chat.io/oauth/token
    .then((response) => {
      res.json(response.data.habitat)
      // console.log(response.data.habitat);
      console.log("grant_type", grant_type);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Listenin on port http://localhost:${port}`);
});
