const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { horario_1, horario_2 } = req.body;
  const mensaje = `Tengo horarios disponibles ${horario_1} y ${horario_2}. ¿Cuál prefieres?`;

  try {
    const response = await axios.post(
      "https://api.voiceflow.com/v2/agent/68424b62ec8e90877c24b893/interact", // ← Asegúrate que este sea tu verdadero agentID
      {
        user_id: "mentes_millonarias_2526", // puedes hacerlo dinámico si quieres
        query: mensaje
      },
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

app.get("/", (req, res) => {
  res.send("¡Servidor Orianna en línea y escuchando!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
