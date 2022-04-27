const express = require("express");
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
const axios = require('axios').default;
const cors = require('cors')
let fs = require("fs");



console.log("here")

const app = express();


let requests = []

let accessToken

const headers = {
  "Authorization" : "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJkYWQ4YzliODBmMzJhZTE1MDNmZDEzNjgyNmRkNjM2OTVkZTE0YTQzODNhN2VjMjJlNTgxM2E1NjY3NmNjYjI3ZWEyYmQxNWJiMDM1ZmE4In0.eyJhdWQiOiJhOTA2YzRjZi1mYWMzLTQ4ODktODhjMC1hZjlhZDZhNGI4YmYiLCJqdGkiOiJiZGFkOGM5YjgwZjMyYWUxNTAzZmQxMzY4MjZkZDYzNjk1ZGUxNGE0MzgzYTdlYzIyZTU4MTNhNTY2NzZjY2IyN2VhMmJkMTViYjAzNWZhOCIsImlhdCI6MTY1MTA4MTE2MywibmJmIjoxNjUxMDgxMTYzLCJleHAiOjE2NTExNjc1NjMsInN1YiI6IjcxNjIzNjYiLCJhY2NvdW50X2lkIjoyOTU0NjIzMCwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImNybSIsIm5vdGlmaWNhdGlvbnMiXX0.L7OxRROSxvxXCtExBqkw15-WK_XQP-78sZ2mBkwnXnoOW4hG5W3AMh6CCtR68dzLFAkqfW_CalVxy-8cZJOO3zo48y-YdVU5jPJ24bIlqJEheyz9Lwx8qkTpJT12afiFm4tN4flNdi0epUqOxQDjh3i0B7YHTPIfIyOVog3McpHAPJwlhLZ2_QFemuI2_pRT66vmV-Gf5H0NTKP19H1xM4YYNdSQVzO6vb5lO9N6AiAiKVvGTAgCQRNtpFj1WzB5YeMVC0M7h1R9e3jxg-hBu6QgEfWtFtH6I2kF270hhbb6at9Jts2oaJ_KM7hoEjur_dCbGl13KI3B9awJKEUlvg"
}

async function getAccessToken ()  {

  fs.readFile("./t.txt", "utf-8", async function(err, buf) {
    if (err)
      return console.log(err);
    accessToken = JSON.parse(buf.toString())

    try {
    
      const newAccessToken = await axios.post( 'https://aurorainc.amocrm.ru/oauth2/access_token', 
      {
        "client_id": "70b22ce9-5e6b-4242-9e71-097fa86cf1d4",
        "client_secret": "xuOck3shRx3jNyFkLfX1s22sItJlXWrmlbkgovU9NNMCAWtkFuUjBxPSi3YS2LMv",
        "grant_type": "refresh_token",
        "refresh_token": accessToken["refresh_token"],
        "redirect_uri": "https://836c-2401-c080-2400-1e26-5400-3ff-fef6-ee7.jp.ngrok.io"
      },
      {
        headers : {
          "Authorization" : accessToken["token_type"] + " " + accessToken["access_token"]
        }
      });
      //console.log("CHECK", newAccessToken)
      newAccessToken = newAccessToken.data
    
      headers["Authorization"] = newAccessToken["token_type"] + " " + newAccessToken["access_token"]
    
      fs.writeFile("t.txt", JSON.stringify(newAccessToken), (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
    } catch (error) {
      //console.log(error)
    }


  });
}

const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

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
    //await getAccessToken()
    const name = req.body.name;
    const phone = req.body.phone;

    console.log("here2")

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
      res.send(response.data)
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