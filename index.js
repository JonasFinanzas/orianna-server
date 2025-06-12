const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { horario_1, horario_2 } = req.body;

  // Crear el mensaje para Voiceflow
  const mensaje = `Tengo horarios disponibles ${horario_1} y ${horario_2}. ¿Cuál prefieres?`;

  // Preparar body a enviar a Voiceflow
  const bodyToSend = {
    user_id: "mentes_millonarias_2526",
    start: true,
    messages: [
      {
        type: "text",
        payload: mensaje
      }
    ],
    config: {
      tts: false,
      stt: false
    }
  };

  // Log para depurar
  console.log("===> Body que se enviará a Voiceflow:");
  console.log(JSON.stringify(bodyToSend, null, 2));

  try {
    // Enviar a Voiceflow
    const response = await axios.post(
      "https://api.voiceflow.com/v2/agent/68424b62ec8e90877c24b893/interact",
      bodyToSend,
      {
        headers: {
          Authorization: "Bearer VF.DM.684504adfc69bc02b8a8ce9a.SJ7WlRIGLHsJwny9",
          "Content-Type": "application/json"
        }
      }
    );

    // Enviar también a Zapier (opcional)
    await axios.post("https://hooks.zapier.com/hooks/catch/23193821/uyu0juh/", {
      horario_1,
      horario_2
    });

    // Responder exitosamente
    res.status(200).send({
      success: true,
      horario_1,
      horario_2,
      voiceflowResponse: response.data
    });

  } catch (err) {
    console.error("Error al enviar a Voiceflow:", err.response?.data || err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

// Prueba rápida desde navegador
app.get("/", (req, res) => {
  res.send("¡Servidor Orianna en línea y escuchando!");
});

// Iniciar servidor
app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
