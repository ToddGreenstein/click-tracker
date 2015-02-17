var core=require("../engine/core.js");
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {
    app.get('/api/profiler/status',core.status);
    app.post('/api/profiler/status/:run',urlencodedParser,function(req,res){
        if(req.params.run.toLowerCase()=="start") {
            core.start(req,res);
            return;
        }
        if(req.params.run.toLowerCase()=="stop"){
            core.stop(req,res);
            return;
        }
        res.status=400;
        res.send({"status":"bad request"});
    });
    app.get('/api/profiler/analytics/light/:by',urlencodedParser,function(req,res){
        var by = req.params.by.toLowerCase()
        if(by=="income" || by=="platform" || by=="department") {
            core.getLightweight(req,res,by);
            return;
        }
        if(by="ops"){
            core.getOps(req,res);
            return;
        }
        res.status=400;
        res.send({"lightweight":"bad request"});
    });
    app.post('/api/profiler/analytics/light',core.setLightweight);
    app.get('/api/profiler/analytics/heavy');
    app.get('/api/profiler/console');
}
