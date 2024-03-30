import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const Name = "Priyanka"


const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"blog",
  password:"Kookie",
  port:5432
})
let list = 0;

db.connect();


db.query("SELECT * FROM blog", (err,res) => {
    if (err){
       console.error("Error",err.stack)
    }
    else{
      console.log(res.rows)
      list = res.rows;
      
    }
    
    
  })




/* Write your code here:
Step 1: Render the home page "/" index.ejs
Step 2: Make sure that static files are linked to and the CSS shows up.
Step 3: Add the routes to handle the render of the about and contact pages.
  Hint: Check the nav bar in the header.ejs to see the button hrefs
Step 4: Add the partials to the about and contact pages to show the header and footer on those pages. */

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",async(req,res) =>{
  res.render("index.ejs",{name:Name,body:list})
})
app.get("/post",(req,res) =>{
    res.render("create.ejs")
  })
app.post("/new", async(req,res) =>{
    const date = new Date();
    
    await db.query("INSERT INTO blog (name,title,text,date) VALUES($1,$2,$3,$4)",[req.body.name,
      req.body.title,req.body.text,date])    
    
    
    let data = await db.query("SELECT * FROM blog");
    list = data.rows;
    // const dic = {title:req.body["title"],
    //              name:req.body["name"],
    //             text:req.body["text"],
    //             date:new Date().toJSON().slice(0, 10)
    //           }
    // list.push(dic)            
    res.redirect("/")
  })  

app.get("/posts/:i",(req,res) =>{
   const id = parseInt(req.params.i);
   console.log(id);
   res.render("posts.ejs",{body:list[id]});
  })   
app.get("/edit/:i",(req,res) =>{
    const id = parseInt(req.params.i);
    res.render("edit.ejs",{body:list[id],i:id})
    
   })   
app.post("/submit/:i", async(req,res) => {
  const i = parseInt(req.params.i);
  const id =list[i].id;
  console.log(id);
  
  if(req.body.name) {await db.query("UPDATE blog SET name = $1 WHERE blog.id = $2", [req.body.name, id])}
  if(req.body.title) {await db.query("UPDATE blog SET title = $1 WHERE blog.id = $2", [req.body.title, id])}
  if(req.body.text) {await db.query("UPDATE blog SET text = $1 WHERE blog.id = $2", [req.body.text, id])}
  
  let data = await db.query("SELECT * FROM blog");
  list = data.rows;

  // if(req.body.title)  {list[i].title = req.body.title;}
  // if(req.body.text) { list[i].text = req.body.text;}
  // if(req.body.name)  {list[i].name = req.body.name;}
  res.redirect("/")
  
  
}) 
app.get("/delete/:i", async (req,res) => {
  const index = parseInt(req.params.i);
  const id = list[index].id;
  console.log(id)
  await db.query("DELETE FROM blog WHERE id=$1",[id]);
  let data = await db.query("SELECT * FROM blog");
  list = data.rows;
  res.redirect("/");
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



