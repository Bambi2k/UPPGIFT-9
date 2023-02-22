var mysql = require("mysql");

let express = require("express");
let bodyParser = require("body-parser");

let { engine } = require("express-handlebars");
const app = express();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pog",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/all-posts", (req, res) => {
  console.log("Hej");
  // gör select * from guestbook
  // lägg resultatet i en variabel som är en array
  // skicka den arrayen till din vy
  var sql = `SELECT * FROM guestbook ORDER BY time DESC`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("get", { result });
  });
});

app.post("/add_posts", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const comment = req.body.comment;
  var sql = `INSERT INTO guestbook (name, email, comment) VALUES ('${name}', '${email}', '${comment}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("/all-posts");
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
