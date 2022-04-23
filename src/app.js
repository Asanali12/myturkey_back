const express = require("express");
const bodyParser = require('body-parser');
const AmoCRM = require( 'amocrm-js' );
const serverless = require("serverless-http");


console.log("here")

const app = express();


let requests = []

const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/requests", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

console.log("here")



router.get("/home", (req, res) => {
  res.redirect('https://myturkey.kz')
});

router.post('/request', async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    
    const crm = new AmoCRM({
      // логин пользователя в портале, где адрес портала domain.amocrm.ru
      domain: 'aurorainc', // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
      /* 
        Информация об интеграции (подробности подключения 
        описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
      */
      auth: {
        client_id: 'f8cef8e7-570a-458d-bd63-17d78b560f2e', // ID интеграции
        client_secret: '4gWhvCDtNEkycxSPCtXW5DlYyc3TJt69biOIxMNYcFnGcO2Ma5Q7F3PbVVYJXHhe', // Секретный ключ
        redirect_uri: 'https://6f93-2401-c080-2400-1e26-5400-3ff-fef6-ee7.jp.ngrok.io', // Ссылка для перенаправления,
        server : {
          port: "3001"
        }
      },
    });

    res.send(crm.connection.getAuthUrl())

    console.log("here2")

    try {
        const contact = await crm.request.post( '/api/v4/contacts', [{
          "first_name": name,
          "custom_fields_values": [
              {
                  "field_id": 319725,
                  "values": [
                      {
                          "value": phone,
                          "enum_code": 'WORK'
                      }
                  ]
              }
         ]
      }]);
      const contactId = contact.data
      console.log("contactId", contactId)
      console.log(contactId._embedded.contacts[0].id)
      const response = await crm.request.post( '/api/v4/leads', [
        {
          "name": name,
          "_embedded": {
            "contacts": [
              {
                "id": contactId._embedded.contacts[0].id
              }
            ]
          }
        }
      ] );
      console.log(response.data)
      //console.log( response.data['validation-errors'][0].errors );
    } catch (error) {
        console.log("error")
        console.log(error)
        res.send(error)
    }
});

app.use(`/.netlify/functions/app`, router);

module.exports = app;
module.exports.handler = serverless(app);
/*app.listen(3000, () => {
    console.log("Server running on port 3000");
});*/