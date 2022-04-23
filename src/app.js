const express = require("express");
const bodyParser = require('body-parser');
const AmoCRM = require( 'amocrm-js' );

console.log("here")

const app = express();


let requests = [] 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/requests", (req, res, next) => {
    res.json(requests);
});

console.log("here")

app.post('/request', async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    
    console.log("here")

    const crm = new AmoCRM({
        // логин пользователя в портале, где адрес портала domain.amocrm.ru
        domain: 'aurorainc', // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
        /* 
          Информация об интеграции (подробности подключения 
          описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
        */
        auth: {
          client_id: '0cd501dd-f9d4-4203-bd8c-2c2b67ac5dd8', // ID интеграции
          client_secret: 'JXkIcJ9RgM7oCejFVkaDg3wSPoVRDaBZQHQ2Kk11L9vI2m03T1dBAkoGrmgcd1Nz', // Секретный ключ
          redirect_uri: 'https://sparkling-crumble-adf4d0.netlify.app', // Ссылка для перенаправления,
          server: {
            // порт, на котором запустится сервер авторизации
            port: 3001
          }
        },
    });

    console.log("here2")
    
    try {
        const url = await crm.connection.getAuthUrl();
        res.send(url);
        const fields = await crm.request.get( '/api/v4/contacts/custom_fields' )
        console.log(fields.data._embedded.custom_fields[1].enums)
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

module.exports = app;

/*app.listen(3000, () => {
    console.log("Server running on port 3000");
});*/