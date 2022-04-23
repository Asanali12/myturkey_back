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

const crm = new AmoCRM({
  // логин пользователя в портале, где адрес портала domain.amocrm.ru
  domain: 'aurorainc', // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
  /* 
    Информация об интеграции (подробности подключения 
    описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
  */
  auth: {
    client_id: '706cc9b1-30a2-408a-b353-c0fabc86b4d1', // ID интеграции
    client_secret: 'aRJ6CBx5bk8nlCBKyvfdCCrtXoSc6O6tax0RSCpddPnllt2KVEBzRP5lxB0GqzZm', // Секретный ключ
    redirect_uri: 'http://65.20.75.136:9000/home', // Ссылка для перенаправления,
    server : {
      port: "3001"
    }
  },
});



router.get("/login", (req, res) => {
  res.send(crm.connection.getAuthUrl())
});

router.get("/home", (req, res) => {
  res.redirect('https://myturkey.kz')
});

router.post('/request', async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    
    
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
      console.log("contactId")
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