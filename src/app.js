const express = require("express");
const bodyParser = require('body-parser');
const AmoCRM = require( 'amocrm-js' );
const serverless = require("serverless-http");
const axios = require('axios').default;



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
    
    /*const crm = new AmoCRM({
      domain: 'aurorainc', // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
      
      auth: {
        client_id: '54e9bc63-131b-41a9-98a4-86c7cca8286e', // ID интеграции
        client_secret: 'xVWTlvoD7coczRxjrdH156rWj7eZ2iH7KiAPzkAihQxqqUvBFK1thUSpHpQ5077P', // Секретный ключ
        redirect_uri: 'https://myturkey.kz', // Ссылка для перенаправления,
        code: "def5020017a1f9ce7bda46fb4b3d1a4eb0fb332d4908126bed9d21d45c1df730b11d245d9043c795b4162b20a50ff7f374f73ae3f1b06fd0ea8a4a10c90484063107705c78cd73a054d3b90693dabcb5f10bb88a27adc908b8be644c2dd5d73e94af5af2fc4f4d723ee6f4eef7e12049be502e0bc8d8e4b939b25fe7dfc88ad6bf7c3fa3699de312452ac30686b9ff38dffbe8deca12c06ed1403b433d6c189417c3b33fae9f81df2ba17871a9f76553ee1cdde6810282908534a3b070296cb96f217fbda9771a4db64f387d931a8eeb3b48ae5a63f3ce7c07c7b46dc23338d45f4de75a9deabbf5bfdd2dae2a3cedce4326865f3f2091bfe5073b130aecdf8268056b35b16abbc6e377bfdf463d4bfa57b480fcb325a3d352407eeeb068c7a4bd300cf6d6ca9fce7b290cb864eb2088ecb32f74c076107812e44421bde175b027e7355d21c5680b43e6d413157cfa98ede52e2235c8883ce3166f4f52638f769fe9c54216ce4364d80bb129fc7c306ec1e30645d7615d4c0cd0b3a48c74bc730c09165a1862b95cc6ee74f9de0339f2a1b568ac83c9d441694087f26d224000dc5109cef21255564b7ca8863cfbb9cf36e29ddeb555bb83fbdd985003"
      },
    });*/

    /*const access_token = await crm.request.post( '/oauth2/access_token', 
    {
      grant_type: "access_token",
      client_id: '54e9bc63-131b-41a9-98a4-86c7cca8286e', // ID интеграции
      client_secret: 'xVWTlvoD7coczRxjrdH156rWj7eZ2iH7KiAPzkAihQxqqUvBFK1thUSpHpQ5077P', // Секретный ключ
      redirect_uri: 'https://myturkey.kz', // Ссылка для перенаправления,
      code: "def5020017a1f9ce7bda46fb4b3d1a4eb0fb332d4908126bed9d21d45c1df730b11d245d9043c795b4162b20a50ff7f374f73ae3f1b06fd0ea8a4a10c90484063107705c78cd73a054d3b90693dabcb5f10bb88a27adc908b8be644c2dd5d73e94af5af2fc4f4d723ee6f4eef7e12049be502e0bc8d8e4b939b25fe7dfc88ad6bf7c3fa3699de312452ac30686b9ff38dffbe8deca12c06ed1403b433d6c189417c3b33fae9f81df2ba17871a9f76553ee1cdde6810282908534a3b070296cb96f217fbda9771a4db64f387d931a8eeb3b48ae5a63f3ce7c07c7b46dc23338d45f4de75a9deabbf5bfdd2dae2a3cedce4326865f3f2091bfe5073b130aecdf8268056b35b16abbc6e377bfdf463d4bfa57b480fcb325a3d352407eeeb068c7a4bd300cf6d6ca9fce7b290cb864eb2088ecb32f74c076107812e44421bde175b027e7355d21c5680b43e6d413157cfa98ede52e2235c8883ce3166f4f52638f769fe9c54216ce4364d80bb129fc7c306ec1e30645d7615d4c0cd0b3a48c74bc730c09165a1862b95cc6ee74f9de0339f2a1b568ac83c9d441694087f26d224000dc5109cef21255564b7ca8863cfbb9cf36e29ddeb555bb83fbdd985003"
    })

    console.log(access_token)
    res.send(crm.connection.getAuthUrl())*/

    console.log("here2")

    const headers = {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNlM2RmMTFlMmYzZTRkNzE2MmM1ZmRkMWNiYzUyN2EwMTZjYjI3NzEwNGI5ZTNlNzIwZmI5NTU3YWZjMmMxZjVjM2VmZWY4MzYwZjBlNWY2In0.eyJhdWQiOiJiNzNjM2ViMC0xYTM1LTRkODktYTgyZC0xOTk3ODcwOWQ0ODIiLCJqdGkiOiJjZTNkZjExZTJmM2U0ZDcxNjJjNWZkZDFjYmM1MjdhMDE2Y2IyNzcxMDRiOWUzZTcyMGZiOTU1N2FmYzJjMWY1YzNlZmVmODM2MGYwZTVmNiIsImlhdCI6MTY1MDc1NDg3NywibmJmIjoxNjUwNzU0ODc3LCJleHAiOjE2NTA4NDEyNzcsInN1YiI6IjcxNjIzNjYiLCJhY2NvdW50X2lkIjoyOTU0NjIzMCwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImNybSIsIm5vdGlmaWNhdGlvbnMiXX0.hkrvAh8PnzK8gQBuzbsPPNpbE3dQA9HPAJ7KxJvS7gzeEqS6pT1Dfz5M7cW7_UG28DzRxoLqViVgCzEZn36PnsuVL2cu3s4H_aSwWRDPEtDAY_kiTR-RykAOvvu4xtfHmc0s-kFQoytyX_wKTNDJxcEGz7upFFLd3Cf9-CA9ZXjVr4oW4NODgxGik_Q8MzwHyNtjTxSx8-oEDMS5dcGEXk1X3-JS1SFvRf3zKTm0ni4upV-NG7bDa319kclV8495KQY0H-Oq3tpiXocU889FlU9QCffVGJGJwc5u9VcH2YPytgc70pKx5O16o5DNQz1mNIZP4BU6I-BJj6Y7FjTsWA'
    }

    try {
        const contact = await axios.post( 'https://aurorainc.amocrm.ru/api/v4/contacts', 
        [{
          "first_name": name,
          "custom_fields_values": [
              {
                  "field_id": 319725,
                  "values": [
                      {
                          "value": phone,
                          "enum_code": "WORK"
                      }
                  ]
              }
         ]
      }],
      {
        headers: headers
      });
      console.log("AAHHASHAHAHAH")
      const contactId = contact.data
      console.log("contactId", contactId)
      console.log(contactId._embedded.contacts[0].id)
      const response = await axios.post( 'https://aurorainc.amocrm.ru/api/v4/leads',
      [
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
      ],
      {
        headers: headers
      });
      console.log(response.data)
      res.send(response)
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