const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { horario_1, horario_2 } = req.body;

  try {
    // Mensaje más natural, las frases ya vienen formateadas desde Zapier
    const mensaje = `Tengo horarios disponibles ${horario_1} y ${horario_2}. ¿Cuál prefieres?`;

    // Enviar mensaje a Voiceflow
    const vfResponse = await axios.post(
      "https://general-runtime.voiceflow.com/state/mentes_millonarias/interact",
      {
        action: {
          type: "text",
          payload: mensaje
        },
        config: {
          tts: false,
          stt: false
        }
      },
      {
        headers: {
          Authorization: "Bearer VF.DM.684504adfc69bc02b8a8ce9a.SJ7WlRIGLHsJwny9",
          "Content-Type": "application/json"
        }
      }
    );

    // (Opcional) enviar a Zapier webhook si quieres seguir usándolo
    await axios.post("https://hooks.zapier.com/hooks/catch/23193821/uyu0juh/", {
      horario_1,
      horario_2
    });

    // Responder a Voiceflow
    res.status(200).send({
      success: true,
      horario_1,
      horario_2,
      voiceflowResponse: vfResponse.data
    });

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
