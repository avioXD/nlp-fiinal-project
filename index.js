const express = require("express");
var hdb = require("hdb");
var bodyParser = require("body-parser");
const UUID = require("uuid-int");
const generator = UUID(0000474);
const router = express.Router();
const app = express();
const path = require("path");
const { NlpManager } = require("node-nlp");
const fs = require("fs");
app.use(bodyParser.json());
const { getSentiment } = require("./text-analyzer");
const manager = new NlpManager({ languages: ["en"], forceNER: true });
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
// for parsing multipart/form-data
app.use(express.static("public"));
// set the view engine to ejs
app.set("view engine", "ejs");
const dbconfig = {
  host: "c1256c5a-fa5f-4d4a-afa8-9b05cad748e0.hana.prod-ap10.hanacloud.ondemand.com",
  port: 443,
  user: "HACK2BUILD#PYTHON",
  password: "&zVf@qfQ(2)$Y-M-8/w6xUCDYPz8;Tc.",
};
////
let data = [];
let all_city = [];
let all_dealer = [];
router.get("/", function (req, res) {
  var client = hdb.createClient(dbconfig);
  client.on("error", function (err) {
    console.error("Network connection error", err);
  });
  client.connect(function (err) {
    if (err) {
      return console.error("Connect error", err);
    }
    try {
      client.exec(
        `SELECT DISTINCT ORT01 FROM "HACK2BUILD"."V_KNA1"`,
        function (err, city) {
          client.end();
          if (err) {
            return console.error, err;
          }
          // console.log("Results:", typeof city, city);
          all_city = city;
          res.render("index", { city: city, data: data });
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
  //__dirname : It will resolve to your project folder.
});

////

router.get("/review/:dealer_id", (req, res) => {
  let selected_dealer = {};
  all_dealer.map((d) => {
    if (d.KUNNR == req.params.dealer_id) {
      selected_dealer = d;
    }
  });
  res.render("review", { data: selected_dealer });
});
router.post("/submit-review/:dealer_id", async (req, res) => {
  // console.log(req.body);
  if (!req.params.dealer_id) {
    res.redirect("/");
  }
  let avg =
    (parseInt(req.body.rating1) +
      parseInt(req.body.rating2) +
      parseInt(req.body.rating3)) /
    3;
  // console.log(avg);
  const nlpResult = await getSentiment(req.body.commentText);
  // console.log(nlpResult);
  // console.log(JSON.stringify(req.params.dealer_id));
  var client = hdb.createClient(dbconfig);
  client.on("error", function (err) {
    console.error("Network connection error", err);
  });
  client.connect(function (err) {
    if (err) {
      return console.error("Connect error", err);
    }
    try {
      client.exec(
        `INSERT INTO "HACK2BUILD#PYTHON"."T_REVIEW_F" (RPMK,KUNNR,RAVG,REM) VALUES ('${generator.uuid()}','${
          req.params.dealer_id
        }', ${avg}, '${nlpResult}')`,
        function (err, result) {
          client.end();
          if (err) {
            return console.log(err), err;
          }
          if (result) {
            res.redirect("/thanks");
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
});
router.get("/thanks", (req, res) => {
  data = [];
  all_city = [];
  all_dealer = [];

  res.render("thanks");
});
/////

router.get("/getdealer", (req, res) => {
  const { CITY } = req.query;
  var client = hdb.createClient(dbconfig);
  client.on("error", function (err) {
    console.error("Network connection error", err);
  });
  client.connect(function (err) {
    if (err) {
      return console.error("Connect error", err);
    }
    try {
      client.exec(
        `SELECT  KUNNR, NAME1,ORT01 FROM "HACK2BUILD"."V_KNA1" WHERE ORT01 = '${CITY}' `,
        function (err, rows) {
          client.end();
          if (err) {
            return console.error, err;
          }
          all_dealer = [...rows];
          res.render("index", {
            data: rows,
            city: all_city,
            selected_city: CITY,
          });
        }
      );
    } catch (e) {
      // console.log(e);
    }
  });
});

app.use("/", router);
const port = process.env.PORT || 4200;

app.listen(port, () => {
  // console.log(`Application is running on port ${port}`);
});
