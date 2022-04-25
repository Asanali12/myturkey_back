const express = require("express");
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
const axios = require('axios').default;
const cors = require('cors')
const fs = require("fs");

const app = express();

let requests = []

/*async function getAccessToken ()  {
  
  let headers = {
    "Authorization" : ""
  }


  let accessToken

  fs.readFile("./t.txt", "utf-8", async function(err, buf) {
    if (err)
      return console.log(err);
    accessToken = JSON.parse(buf.toString())


    try {
    
      let newAccessToken = await axios.post( 'https://aurorainc.amocrm.ru/oauth2/access_token', 
      {
        "client_id": "a906c4cf-fac3-4889-88c0-af9ad6a4b8bf",
        "client_secret": "s81Z3hlUMY2rhV5aMLK5txSC4gMupP1xRdNLyuW0zadO7Lqqu8SeQ2WMtRolAOUZ",
        "grant_type": "refresh_token",
        "refresh_token": accessToken["refresh_token"],
        "redirect_uri": "https://836c-2401-c080-2400-1e26-5400-3ff-fef6-ee7.jp.ngrok.io"
      },
      {
        headers : {
          "Authorization" : accessToken["token_type"] + " " + accessToken["access_token"]
        }
      });
      newAccessToken = newAccessToken.data
    
      headers["Authorization"] = newAccessToken["token_type"] + " " + newAccessToken["access_token"]
    
      fs.writeFile("t.txt", JSON.stringify(newAccessToken), (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
    } catch (error) {
      console.log("getAccessToken ERROR", error)
    }
  });
  return headers
}*/

const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

router.get("/requests", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

router.get("/home", (req, res) => {
  res.redirect('https://myturkey.kz')
});

router.post('/request', async (req, res) => {


  const name = req.body.name;
  const phone = req.body.phone;
  
  let headers = {
    "Authorization" : ""
  }

  let accessToken

    fs.readFile("./t.txt", "utf-8", async function(err, buf) {
      if (err)
        return console.log(err);
      accessToken = JSON.parse(buf.toString())


      try {
      
        let newAccessToken = await axios.post( 'https://aurorainc.amocrm.ru/oauth2/access_token', 
        {
          "client_id": "a906c4cf-fac3-4889-88c0-af9ad6a4b8bf",
          "client_secret": "s81Z3hlUMY2rhV5aMLK5txSC4gMupP1xRdNLyuW0zadO7Lqqu8SeQ2WMtRolAOUZ",
          "grant_type": "refresh_token",
          "refresh_token": accessToken["refresh_token"],
          "redirect_uri": "https://836c-2401-c080-2400-1e26-5400-3ff-fef6-ee7.jp.ngrok.io"
        },
        {
          headers : {
            "Authorization" : accessToken["token_type"] + " " + accessToken["access_token"]
          }
        });
        newAccessToken = newAccessToken.data
      
        headers["Authorization"] = newAccessToken["token_type"] + " " + newAccessToken["access_token"]
      
        fs.writeFile("t.txt", JSON.stringify(newAccessToken), (err) => {
          if (err) console.log(err);
          console.log("Successfully Written to File.");
        });

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
                  }]
              }]
          }],
          {
            headers: headers
          });
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
          res.send(response)
        } catch (error) {
            console.log("body of requests error")
            console.log(error)
            res.send(error)
        }



      } catch (error) {
        console.log("getAccessToken ERROR", error)
      }
    });
});

app.use(`/.netlify/functions/app`, router);

module.exports = app;
module.exports.handler = serverless(app);