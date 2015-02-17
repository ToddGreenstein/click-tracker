var generator= require('./generator');
var db = require('./data.js');
var http = require('http');
/**
 *
 * @param req
 * @param res
 */
module.exports.start=function(req,res){
    generator.run(function(err,result){
        if(err){
            res.status=400;
            res.send({'profiler':'post','run':err});
            return;
        }
        res.status=201;
        res.send({'profiler':'post','run':result});
    });
}

/**
 *
 * @param req
 * @param res
 */
module.exports.stop=function(req,res){
    generator.stop(function(err,result){
        if(err){
            res.status=400;
            res.send({'profiler':'post','stop':err});
            return;
        }
        res.status=201;
        res.send({'profiler':'post','stop':result});
    });
}

/**
 *
 * @param req
 * @param res
 */
module.exports.status=function(req,res){
    generator.status(function(err,result){
        if(err){
            res.status=400;
            res.send({'profiler':'bad request, '+err});
            return;
        }
        res.status=200;
        res.send({'profiler':'get','status':result});
    })
}

module.exports.setLightweight = function(req,res){
    db.buildView(function(err,result){
        if(err){
            res.status=400;
            res.send({'profiler':'bad request, '+err});
            return;
        }
        res.status=200;
        res.send({'profiler':'post','setLightweight':result});
    });
}

module.exports.getLightweight = function(req,res,view) {
    db.readView('lightweight', view, function (err, result) {
        if (err) {
            res.status = 400;
            res.send({'profiler': 'bad request, ' + err});
            return;
        }
        res.status = 200;
        res.send({'profiler': 'get', 'getLightweight': result});
    });
}

/**
 *
 * @param opsV
 */
module.exports.getOps = function(req,res) {
    http.get("http://" + db.endPoint + "/pools/default/buckets/default", function (result) {
        var data="";
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            data += chunk;
        });
        result.on('end',function(){
            var parsed=JSON.parse(data);
            res.status = 200;
            res.send({'profiler': 'get', 'getLightweight': Math.round(parsed.basicStats.opsPerSec)});
            //opsV(Math.round(parsed.basicStats.opsPerSec));
        });
    });
}
