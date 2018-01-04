var db = require('./db.js');
var url = require('url');

//exports.getList = function (req, resp) {
//    db.GetList("", function (dd2, Error1) {
//        if (Error1) {

//        }
//        else {
//            resp.writeHead(200, { "Content-type": "application:json" });
//            resp.write(JSON.stringify(dd2));
//            resp.end();
//        }
//    });
//};

exports.getList = function (req, resp) {
    db.GetParentsList("", function (dd2, Error1) {
        if (Error1) {

        }
        else {
            db.GetList(JSON.stringify(dd2), function (dd, Error2) {
                
                if (Error2) {

                }
                else {
                    resp.writeHead(200, { "Content-type": "application:json" });
                    resp.write(JSON.stringify(dd));
                    resp.end();
                }
            });
            
        }
    });
};

// exports.getList = function (req, resp) {
//             db.GetList("", function (dd, Error2) {
                
//                 if (Error2) {

//                 }
//                 else {
//                     resp.writeHead(200, { "Content-type": "application:json" });
//                     resp.write(JSON.stringify(dd));
//                     resp.end();
//                 }
//             });
// };

exports.getStateInfo = function (req, resp) {
    db.GetStateInfo("", function (dd, Error1) {
        if (Error1) {

        }
        else {
            resp.writeHead(200, { "Content-type": "application:json" });
            resp.write(JSON.stringify(dd));
            resp.end();
        }
    });
};

exports.getCityInfo = function (req, resp) {
    db.getCityInfo(url.parse(req.url, true).query.SRC, function (dd, Error1) {
        if (Error1) {

        }
        else {
            resp.writeHead(200, { "Content-type": "application:json" });
            resp.write(JSON.stringify(dd));
            resp.end();
        }
    });

}

exports.saveinformation = function (req, resp) {
    db.SavesParentsInformation(url.parse(req.url, true).query.SS, function (dd, Error1) {
        if (Error1) {

        }
        else {
            
            db.savestudentsinformation(url.parse(req.url, true).query.SS, dd, function (dd1, Error2) {
                if (Error2) {

                }
                else {
                    resp.writeHead(200, { "Content-type": "application:json" });
                    resp.write(JSON.stringify('true'));
                    resp.end();
                }
            })

        }
    });

}

exports.IsUnique = function (req, resp) {
    
    db.GetParentsInformationFromPhoneNumber(url.parse(req.url, true).query.SS, function (dd2, Error1) {
        if (Error1) {

        }
        else {
            var arr = dd2;
            console.log(dd2);
            if (arr.length > 0) {
                db.GetStudentsInformationFromParentID(arr[0].ID, function (dd3, Error3) {
                    if (Error3) {

                    }
                    else {
                        var arr1 = dd3;
                        var cnt = 0;
                        if (arr1.length > 0) {
                            for (cnt = 0; cnt < arr1.length; cnt++) {
                                if (arr1[cnt].Name === url.parse(req.url, true).query.SD) {
                                    console.log(arr1);
                                    resp.writeHead(200, { "Content-type": "application:json" });
                                    resp.write(JSON.stringify('false'));
                                    resp.end();
                                    break;
                                }
                            };
                            
                            if (cnt === arr1.length) {
                                resp.writeHead(200, { "Content-type": "application:json" });
                                resp.write(JSON.stringify('true'));
                                resp.end();
                            }
                            
                            // {
                            //    resp.writeHead(200, { "Content-type": "application:json" });
                            //    resp.write(JSON.stringify('true'));
                            //    resp.end();
                            //}
                        }
                        else {
                            resp.writeHead(200, { "Content-type": "application:json" });
                            resp.write(JSON.stringify('true'));
                            resp.end();
                        }
                    }
                });
            } //Length checked for first time
            else {
                resp.writeHead(200, { "Content-type": "application:json" });
                resp.write(JSON.stringify('true'));
                resp.end();
            }
        } //Main Else
    });
};

exports.Login = function (req, resp) {
    console.log('Login request make...')
    console.log(req.url)
    db.IsLoginCredentialsExists(url.parse(req.url, true).query.SS, url.parse(req.url, true).query.SD, function (dd, Error1) {
        if (Error1) {
            console.log('login error...')
            throw Error1;
        }
        else {
            
            if (dd === "false") {
                console.log('Not Valid User...')
                resp.writeHead(200, { "Content-type": "application:json" });
                resp.write(JSON.stringify('Not Valid User'));
                resp.end();
            }
            else {
                console.log('Login success...')
                resp.writeHead(200, { "Content-type": "application:json" });
                resp.write(JSON.stringify('true'));
                resp.end();
                
                //db.IsLoggedUserAdmin(url.parse(req.url, true).query.SS, dd, function (dd1, Error2) {
                //    if (Error2) {
                //        throw Error2;
                //    }
                //    else {
                //        if (JSON.stringify(dd1) === "false") {
                //            resp.writeHead(200, { "Content-type": "application:json" });
                //            resp.write(JSON.stringify('false'));
                //            resp.end();
                //        } else {
                //            resp.writeHead(200, { "Content-type": "application:json" });
                //            resp.write(JSON.stringify('true'));
                //            resp.end();
                //        }
                //    }
                //});

            }
        }
    });
    //console.log(resp);
};