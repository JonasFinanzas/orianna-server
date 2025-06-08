const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { horario_1, horario_2 } = req.body;

  try {
    const response = await axios.post(
      "https://general-runtime.voiceflow.com/state/user_1234/interact",
      {
        action: {
          type: "text",
          payload: `Tengo horarios disponibles a las ${horario_1} y a las ${horario_2}. ¿Cuál prefieres?`
        },
        config: {
          tts: false,
          stt: false
        }
      },
      {
        headers: {
          Authorization: "Bearer VF.1234abcd5678efgh",
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).send({ success: true, voiceflowResponse: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("¡Servidor Orianna en línea y escuchando!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
