const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { horario_1, horario_2 } = req.body;

  const mensaje = `Tengo horarios disponibles ${horario_1} y ${horario_2}. ¿Cuál prefieres?`;

  console.log("Enviando mensaje a Voiceflow:", mensaje);

  try {
    const response = await axios.post(
      'https://general-runtime.voiceflow.com/state/user/mentes_millonarias_2526/interact',
      {
        request: {
          type: 'text',
          payload: mensaje,
        },
      },
      {
        headers: {
          Authorization: 'Bearer VF.DM.684504adfc69bc02b8a8ce9a.SJ7WlRIGLHsJwny9',
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error('Error al enviar a Voiceflow:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error interno al enviar a Voiceflow' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
