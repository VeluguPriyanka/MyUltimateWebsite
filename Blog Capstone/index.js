import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const Name = "Priyanka"
const list = [];
/* Write your code here:
Step 1: Render the home page "/" index.ejs
Step 2: Make sure that static files are linked to and the CSS shows up.
Step 3: Add the routes to handle the render of the about and contact pages.
  Hint: Check the nav bar in the header.ejs to see the button hrefs
Step 4: Add the partials to the about and contact pages to show the header and footer on those pages. */

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res) =>{
   res.render("index.ejs",{name:Name,body:list})
})
app.get("/post",(req,res) =>{
    res.render("create.ejs")
  })
app.post("/",(req,res) =>{
    const dic = {title:req.body["title"],
                 name:req.body["name"],
                text:req.body["text"]}
    list.push(dic)            
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
app.post("/submit/:i", (req,res) => {
  const id = parseInt(req.params.i);
  if(req.body.title)  {list[id].title = req.body.title;}
  if(req.body.text) { list[id].text = req.body.text;}
  if(req.body.name)  {list[id].name = req.body.name;}
  res.redirect("/");
  
}) 
app.get("/delete/:i", (req,res) => {
  const index = parseInt(req.params.i);
  list.splice(index,1);
  console.log(index);
  res.redirect("/");
})
 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



