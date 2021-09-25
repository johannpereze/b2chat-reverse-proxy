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

  var data = JSON.stringify({
    "from": "+573137544892",
    "to": "+573192161411",
    "contact_name": "",
    "template_name": "recordatorio_cita_vigente_3",
    "campaign_name": "ensayo",
    "values": [
      "Johann Sebastian",
      "Prevenga Caldas",
      "01/08/2021",
      "10:00:00",
      "Juan Camilo Ramos"
    ]
  });
  
  var config = {
    method: 'post',
    url: 'https://api.b2chat.io/broadcast',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer dc2a5766-90c9-4afb-81e6-060346f1d761'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    res.json(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
});


//Listener
app.listen(port, () => {
  console.log(`Listenin on port http://localhost:${port}`);
});
