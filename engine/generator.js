var faker = require('faker');
var db = require('./data.js');

var threshold=2000;
var testInterval=5;
var currentCount=0;
var active=false;
var timer;
db.upsert("status",{running:false},function(err,result){});

/**
 *
 */
function createUser(){
    var u = faker.helpers.createCard();
    db.createProfile(u.email,u,function(err,result){
            if(err){
                console.log("ERR:",err);
                createUser();
            }
            if(result && active)
            {
                createUser();
            }else if(!active){
                currentCount--;
                console.log("CUR:",currentCount);
            }
        });
}

/**
 *
 */
module.exports.run = function(done){
    active=true;
    timer=setInterval(function () {
                          if (currentCount < threshold) {
                              console.log("CUR:",currentCount);
                              currentCount++;
                              createUser();
                          } else {}
                      }, testInterval
    );
    db.upsert("status",{running:true},function(err,result){
        if(err) {
            done(err, null);
            return''
        }
        done("running",null);
    });
};

/**
 *
 */
module.exports.stop = function(done){
    active=false;
    clearInterval(timer);
    db.upsert("status",{running:false},function(err,result){
        if(err) {
            done(err, null);
            return;
        }
        done(null,"stopped");
    });
}

/**
 *
 * @param done
 */
module.exports.status = function(done){
    db.read("status",function(err,result){
        if(err){
            done(err,null);
            return;
        }
        done(null,(result.value.running)?"running":"stopped");
    });
}
