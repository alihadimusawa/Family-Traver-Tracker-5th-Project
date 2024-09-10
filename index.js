import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

// store all the user
var allUsersData;
var users;


// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// check visited countries from a specific user
async function checkVisisted(userId) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1;", [userId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {

  allUsersData = await db.query("SELECT * FROM users");
  users = allUsersData.rows;

  const countries = await checkVisisted(currentUserId);
  let color = await db.query("SELECT color FROM users WHERE id = $1", [currentUserId]);

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: color.rows[0].color,
  });
});


app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    let countryCode = data.country_code;
    countryCode = countryCode.trim();

    console.log(countryCode); 

    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId] 
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {

  if(req.body.add){
    res.render("new.ejs");
    return;
  }

  const pressedUserId = req.body.user;
  let matchedUser;
  for(const user of users){
    if (user.id == pressedUserId){
      matchedUser = user;
    }
  }

  currentUserId = matchedUser.id;
  res.redirect("/");
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html

  const currentName = req.body.name;
  const currentColor = req.body.color;

  const currentId = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id", 
    [currentName, currentColor]);

  currentUserId = currentId.rows[0].id;
  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
