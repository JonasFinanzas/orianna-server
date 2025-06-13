const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { horario_1, horario_2 } = req.body;

  const mensaje = `Tengo horarios disponibles ${horario_1} y ${horario_2}. ¿Cuál prefieres?`;

  console.log("Enviando mensaje a Voiceflow:", mensaje);

  try {
    const vfResponse = await axios.post(
      "https://general-runtime.voiceflow.com/state/user/mentes_millonarias_2526/interact",
      {
        request: {
          type: "text",
          payload: mensaje
        }
      },
      {
        headers: {
          Authorization: "Bearer VF.DM.684504adfc69bc02b8a8ce9a.SJ7WlRIGLHsJwny9",
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).send({ success: true, voiceflowResponse: vfResponse.data });
  } catch (err) {
    console.error("Error al enviar a Voiceflow:", err.response?.data || err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("¡Servidor Orianna en línea y escuchando!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
