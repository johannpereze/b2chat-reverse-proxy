const { default: axios } = require("axios");
const express = require("express");
const { response, request } = require("express"); //Esto es para tener el tipado de res y req
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
require("dotenv").config();

//Configuración de CORS
app.use(
  cors({
    origin: "*",
  })
);

//MIDDLEWARES
//Lectura y parseo del body en POST y PUT
app.use(express.json());

const port = process.env.PORT;
const LOGIN_HASH = process.env.LOGIN_HASH;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

//ENDPOINTS

//Prueba de conexión
app.get("/", function (req, res) {
  res.send("There is no info in root");
});

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
  //Obtenemos el token de autotización desde los headers
  const b2ChatToken = req.headers.authorization;
  // console.log(b2ChatToken);

  //Obtenemos el body
  const data = req.body;
  // console.log(req.body);

  var config = {
    method: "post",
    url: "https://api.b2chat.io/broadcast",
    headers: {
      "Content-Type": "application/json",
      Authorization: b2ChatToken,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
      res.json(response.data); //no me estaba enviando esta respuesta a la consola del navegador porque falyaba el .data. Tiraba este error: TypeError: Converting circular structure to JSON
    })
    .catch(function (error) {
      console.log(error);
    });
});

//Listener
app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});

//Endpoint para obtener las citas scrapeando dentalink
app.get("/getappointments", async (req = request, res = response) => {
  console.clear();
  console.log("Params: ", req.query.clinicId);
  const response = await getAppointments(req.query.clinicId); 

  // await Promise.all(response).then((response) => res.json(response));

  // console.log("La response dentro del get: ", response);

  res.json(response);
});

// const getResponse = async (clinics) => {
//   // const appointmentsList = []
//   const appointments = await clinics.map(async ({ id }) => {
//     console.log("Imprimo ID dentro del forEach: ", id);
//     return await getAppointments(id);
//   });

//   return appointments;
// };

//PUPPETEER

const getAppointments = async (clinic = 0) => {
  //luego que reciba las sedes como argumentos ()

  console.log("Abriendo Navegador");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://prevenga.dentalink.cl/sessions/login");

  await page.waitForSelector('input[name="rut"]');
  console.log("Tipeando credenciales");
  await page.type('input[name="rut"]', clinic);
  await page.type('input[name="password"]', PASSWORD);
  await page.click(".btn-success");
  console.log("ya hice clic y voy a esperar que cargue la agenda");
  // await page.waitForSelector("i.fa.fa-fw.fa-home");
  // console.log("Haciendo clic en sucursal elegida");
  // await page.click("i.fa.fa-fw.fa-home");
  // await page.waitForSelector(`a[href="/sucursales/set/${clinic}"]`);
  // await page.click(`a[href="/sucursales/set/${clinic}"]`); //siempre falla aquí
  // //TODO: Hacer clic en la sucursal, y ahora sí, esperar a que cargue .appointment

  // await page.waitForSelector("td.nombre-paciente");
  await page.waitForSelector(".appointment");
  console.log("Ya cargó mi sucursal, voy a buscar las citas");

  const appointments = await page.evaluate(() => {
    const appointmentsElements = document.querySelectorAll(".appointment");
    const patientsList = [];
    appointmentsElements.forEach((appointment, i) => {
      // patientsList.push(appointment.innerHTML); //Esta me trae todos los ids que necesito
      patientsList.push(appointment.textContent);
      // patientsList.push(appointment.children[1].innerText);
    });
    // patientsList.forEach((patient) => {
    //   console.log("Así luce un patient: ", patient);
    // });
    return patientsList;
  });

  console.log(appointments);

  await browser.close();
  console.log("Navegador cerrado");
  return appointments;
};


// puppeteerUser)
const clinics = [
  { id: 1, nombre: "Prevenga La Ceja" },
  { id: 2, nombre: "Prevenga Barbosa" },
  { id: 3, nombre: "Prevenga Itagüí" },
  { id: 4, nombre: "Prevenga Belén La Villa" },
  { id: 5, nombre: "Prevenga Sabaneta" },
  { id: 6, nombre: "Prevenga Prosalco Floresta" },
  { id: 7, nombre: "Prevenga Éxito San Antonio" },
  { id: 8, nombre: "Prevenga Caldas" },
  { id: 9, nombre: "Coopsana Centro" },
  { id: 10, nombre: "Coopsana Norte" },
  { id: 11, nombre: "Coopsana Av. Oriental" },
  { id: 12, nombre: "Coopsana Calasanz" },
  { id: 13, nombre: "Almacén" },
  { id: 14, nombre: "Prevenga Bello" },
  { id: 15, nombre: "Prevenga VIVA Envigado" },
  { id: 16, nombre: "Prevenga López de Mesa" },
  { id: 17, nombre: "Videoconsulta" },
  { id: 18, nombre: "Prevenga La Unión" },
  { id: 19, nombre: "Prevenga Buenos Aires" },
  { id: 20, nombre: "Prevenga San Antonio de Prado" },
  { id: 21, nombre: "Prevenga Caldas Parque" },
  { id: 22, nombre: "Prevenga El porvenir Rionegro" },
  { id: 23, nombre: "Insumos Laboratorio" },
  { id: 24, nombre: "Prevenga El Retiro" },
];
