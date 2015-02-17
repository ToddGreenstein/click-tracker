/**
 *
 * @type {exports}
 */
var couchbase = require('couchbase');
var endPoint = '192.168.41.101:8091';
var myCluster = new couchbase.Cluster(endPoint);
var myBucket = myCluster.openBucket('default');
var db=myBucket;

function reInit(){
    myBucket = myCluster.openBucket('default');
}
/**
 *
 * @param key
 * @param item
 * @param done
 */
module.exports.createProfile = function(key, item,done){
    //console.log("debug:","key:", key," item:", item);
    db.upsert(key, item, function(err, result){
        if(err) {
            done(err, null);
        }
        done(null, result);
    });
}

/**
 *
 * @param key
 * @param val
 * @param done
 */
module.exports.upsert = function (key, val, done) {
    db.upsert(key, val, function (err, res) {
        if (err) {
            console.log("DB.UPSERT:", err);
            done(err, null);
            return;
        }
        done(null, res);
    });
}

/**
 *
 * @param key
 * @param done
 */
module.exports.read = function (key, done) {
    db.get(key, function (err, result) {
        if (err) {
            console.log("DB.READ:", err);
            reInit();
            done(err, null);
            return;
        }
        done(null, result);
    });
}

/**
 *
 * @param done
 */
module.exports.reset=function(done){
    var mgr=myBucket.manager('Administrator','password');
    mgr.flush(function(err,complete){
        if(complete){
            done("complete");
        }
    });
}

/**
 *
 * @param des
 * @param view
 * @param done
 */
module.exports.readView = function (des, view, done) {
    var viewQuery = couchbase.ViewQuery;
    var query = viewQuery.from(des, view).order(2).group(true);
    db.query(query, function (err, results) {
        if (err) {
            done(err, null);
        }
        done(null, results);
    });
}

/**
 *
 * @param done
 */
module.exports.buildView = function (done) {
    var mgr = myBucket.manager('Administrator', 'password');
    mgr.insertDesignDocument('lightweight', {
        views: {
            'department': {
                map: function (doc, meta) {
                    if (doc.clickHistory) {
                        if (doc.clickHistory.length > 0) {
                            for (i = 0; i < doc.clickHistory.length; i++) {
                                if (doc.clickHistory[i].addedToCart == "yes") {
                                    emit(doc.clickHistory[i].department, 1);
                                }
                            }
                        }
                    }
                },
                reduce: "_sum"
            },
            'platform': {
                map: function (doc, meta) {
                    if (doc.clickHistory) {
                        if (doc.clickHistory.length > 0) {
                            for (i = 0; i < doc.clickHistory.length; i++) {
                                if (doc.clickHistory[i].addedToCart == "yes") {
                                    emit(doc.clickHistory[i].browserType, 1);
                                }
                            }
                        }
                    }
                },
                reduce: "_sum"
            },
            'income': {
                map: function (doc, meta) {
                    if (doc.clickHistory) {
                        if (doc.clickHistory.length > 0) {
                            function setRange(amt) {
                                if (amt < 70000)return "70k";
                                if (amt > 70000 && amt <= 80000) return "70k-80k";
                                if (amt > 80000 && amt <= 90000) return "80k-90k";
                                if (amt > 90000 && amt <= 100000) return "90k-100k";
                                if (amt > 100000 && amt <= 110000) return "100k-110k";
                                if (amt > 110000 && amt <= 120000) return "110k-120k";
                                if (amt > 120000 && amt <= 130000) return "120k-130k";
                                if (amt > 130000 && amt <= 140000) return "130k-140k";
                                if (amt > 140000 && amt <= 150000) return "140k-150k";
                                if (amt > 150000 && amt <= 160000) return "150k-160k";
                                if (amt > 160000 && amt <= 170000) return "160k-170k";
                                if (amt > 170000 && amt <= 180000) return "170k-180k";
                                if (amt > 180000 && amt <= 190000) return "180k-190k";
                                if (amt > 190000 && amt <= 200000) return "190k-200k";
                                if (amt > 200000 && amt <= 210000) return "200k-210k";
                                if (amt > 210000 && amt <= 220000) return "210k-220k";
                                if (amt > 220000 && amt <= 230000) return "220k-230k";
                                if (amt > 230000 && amt <= 240000) return "230k-240k";
                                if (amt > 240000 && amt <= 250000) return "240k-250k";
                                if (amt > 250000) return "250K";
                            }

                            for (i = 0; i < doc.clickHistory.length; i++) {
                                if (doc.clickHistory[i].addedToCart == "yes") {
                                    emit(setRange(doc.income), 1);
                                }
                            }
                        }
                    }
                },
                reduce: '_sum'
            }
        }
    }, function (err) {
        if (err) {
            done(err, null);
        }
        done(null, "complete");
    });
}

module.exports.endPoint=endPoint;