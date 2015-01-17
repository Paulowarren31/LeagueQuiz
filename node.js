var express  = require('express');
var cors = require('cors');
var app = express();

var globalScore=1;

app.use(cors());

app.get('/api/globalscore',function(req,res){
  res.send({score:globalScore});
})
app.put('/api/globalscore/:num',function(req,res){

  globalScore=globalScore+parseInt(req.params.num);

  res.send({sent:parseInt(req.params.num),type:typeof parseInt(req.params.num)})
})

app.listen(8080);
console.log("App listening on port 8080");
