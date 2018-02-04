var mysql = require('mysql')
var sync = require('synchronize');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBn7yxnlu-W_eeHfSEVYyHSnh9hMkgBqwE', // for Mapquest, OpenCage, Google Premier
    formatter: 'json'        // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

var connection = mysql.createConnection({
   host     : 'myschooldb.cqpg3lhg6zxx.us-east-2.rds.amazonaws.com',
   user     : 'master',
   password : 'masterschool',
   database : 'myschool',
   multipleStatements: true
});


var connection2 = mysql.createConnection({
    host     : 'localhost',
    port     : '3307',
    user     : 'root',
    password : 'foradian',
    database : 'fedena_ultimate',
    multipleStatements: true
});

connection.connect(function (err) {
    //if (err) throw err
    console.log('You are now connected to ... myschool @ myschooldb aws')
})
connection2.connect(function (err) {
    //if (err) throw err
    console.log('You are now connected to ... fedena_ultimate @ localhost')
})

exports.GetList2 = function (data, callback) {
    var Students = [];

    connection2.query('select id,admission_no,admission_date,first_name,middle_name,last_name,batch_id,date_of_birth,gender,blood_group,birth_place,nationality_id,language,religion,student_category_id,address_line1,city,state,pin_code,country_id,phone1,phone2,email,is_sms_enabled,is_active,is_deleted,created_at,updated_at,has_paid_fees from students', function (error, results, fields) {
        if (error) { throw error; }
        else {
            for (var i = 0; i < results.length; i++) {
                
                 Students.push(new Student2(results[i].id,
                                             results[i].admission_no,
                                             results[i].admission_date,
                                             results[i].first_name,
                                             results[i].middle_name,
                                             results[i].last_name,
                                             results[i].batch_id,
                                             results[i].date_of_birth,
                                             results[i].gender,
                                             results[i].blood_group,
                                             results[i].birth_place,
                                             results[i].nationality_id,
                                             results[i].language,
                                             results[i].religion,
                                             results[i].student_category_id,
                                             results[i].address_line1,
                                             results[i].city,
                                             results[i].state,
                                             results[i].pin_code,
                                             results[i].country_id,
                                             results[i].phone1,
                                             results[i].phone2,
                                             results[i].email,
                                             results[i].is_sms_enabled,
                                             results[i].is_active,
                                             results[i].is_deleted,
                                             results[i].created_at,
                                             results[i].updated_at,
                                             results[i].has_paid_fees));
            };
            var dd = Students;
            callback(dd);
        }
        //res.end(JSON.stringify(results));;
    });
};


exports.GetList = function (data, callback) {
    var Students = [];
    
    connection.query('select * from students', function (error, results, fields) {
        if (error) { throw error; }
        else {
            var PP = JSON.parse(data, true);
            for (var i = 0; i < results.length; i++) {
                var PID = results[i].Parent_ID;
                var ParentsName;
                var ParentsContact;
                var ParentsEmail;
                for (var j = 0; j < PP.length; j++) {
                    if (PP[j].PID === PID) {
                        ParentsName = PP[j].PName;
                        ParentsContact = PP[j].PContact;
                        ParentsEmail = PP[j].PEmail;
                        break;
                    }
                };
                
                Students.push(new Student(results[i].ID, results[i].Address, results[i].Name, ParentsName, results[i].City, results[i].State ,ParentsContact, ParentsEmail, "2344555669"));
            };
            var dd = Students;
            callback(dd);
        }
        //res.end(JSON.stringify(results));;
    });
};
exports.GetParentsInformationFromPhoneNumber = function (data, callback) {
    var Students = [];
    
    connection.query('select * from parents where Contact = ?', JSON.parse(data, true), function (error, results, fields) {
        if (error) { throw error; }
        else {
            var dd = results;
            callback(dd);
        }
        //res.end(JSON.stringify(results));;
    });
};

exports.GetStudentsInformationFromParentID = function (data, callback) {
    var Students = [];
    
    connection.query('select * from students where Parent_ID = ?', JSON.parse(data, true), function (error, results, fields) {
        if (error) { throw error; }
        else {
            var dd = results;
            callback(dd);
        }
        //res.end(JSON.stringify(results));;
    });
};

exports.GetParentsList = function (data, callback) {
    var Parents = [];
    var Students = [];
    
    connection.query('select * from parents', function (error, results, fields) {
        if (error) { throw error; }
        else {
            
            for (var i = 0; i < results.length; i++) {
                Parents.push(new Parent(results[i].ID, results[i].Name, results[i].No_Of_Students, results[i].Email, results[i].Contact));
            };
            
            data = Parents;
            callback(data);
        }
    });
};

exports.GetStateInfo = function (data, callback) {
    var states = [];
    
    connection.query("select * from StateInfo", function (error, results, fields) {
        
        if (error) {
            throw error;
        }
        else {
            for (var i = 0; i < results.length; i++) {
                states.push(new stateInfo(results[i].StateID, results[i].StateName));
            };
            data = states;
            callback(data);
        }
    });
    
    //states.push(new stateInfo(1, "Maharashtra"));
    //states.push(new stateInfo(2, "Gujrat"));
    //states.push(new stateInfo(3, "Goa"));
    
};

exports.GetCountryList = function (data, callback) {
    var list = [];

    connection2.query("select * from countries", function (error, results, fields) {

        if (error) {
            throw error;
        }
        else {
            for (var i = 0; i < results.length; i++) {
                list.push(new countryInfo(results[i].id, results[i].name));
            };
            data = list;
            callback(data);
        }
    });
};

exports.getCityInfo = function (data, callback) {
    var cities = [];
    //cities.push(new cityInfo(1, "Pune", 1));
    //cities.push(new cityInfo(2, "Ahamdabad", 2));
    //cities.push(new cityInfo(3, "Panji", 3));
    
    connection.query("select * from CityInfo", function (error, results, fields) {
        
        if (error) {
            throw error;
        }
        else {
            for (var i = 0; i < results.length; i++) {
                cities.push(new cityInfo(results[i].CityID, results[i].CityName, results[i].StateID));
            };
            var citID = data;
            
            var output = cities.filter(function (x) { return x.cityid == citID }); //arr here is you result array
            data = output;
            callback(data);
        }
    });
};

exports.saveinformation = function (data, callback) {
    var Students = [];
    
    //connection.query('select * from parents', function (error, results, fields) {
    //    if (error) { throw error; }
    //    else {
    //        var vv = JSON.parse(data, true);
            
    //        var ss = "INSERT INTO parents (ID,Name,No_Of_Students,Email,Contact) VALUES (?,?,?,?,?)";
    //        connection.query(ss, [results.length + 1 , vv.ParentsName, 1, vv.ParentEmail, vv.ParentContact], function (err, rows) {
    //            if (err) {
    //                callback("", err);
    //            }

    //            else {
    //                connection.query('select * from students', function (error1, results1, fields1) {
    //                    if (error1) {
    //                        callback("", err);
    //                    }
    //                    else {
    //                        var ss1 = "INSERT INTO students (ID,Name,Class,Parent_ID,Subscription_ID,Dispatch_Center_ID,Address) VALUES (?,?,?,?,?,?,?)";
    //                        connection.query(ss1, [results1[results1.length].ID, vv.Name, 1, results.length + 1, 1, 1, "Sangvi"], function (err, rows) {
    //                            if (err) {
    //                                callback("", err);
    //                            }
    //                        });
    //                    } //else of select * from query
    //                })//Connection select End
    //            }//else of Insert Into Parents
    //        });
    //    }
    //});
  

    //SavesParentsInformation("", function (data, error1) {
    //    if (error1) {

    //    }
    //    else {
            
    //    }

    //});    
};

exports.savestudentsinformation = function (data, ParentsID, callback) {
    var Students = [];
    
    connection.query('select * from students', function (error, results, fields) {
        if (error) { throw error; }
        else {
            
            var PI = JSON.parse(ParentsID, true);
            
            
            var vv = JSON.parse(data, true);
            
            var UniqueNo = null;
            if (results.length == 0) {
                UniqueNo = 1;
            }
            else
                 UniqueNo = results[results.length - 1].ID + 1;
            var SD = "INSERT INTO students (ID,Name,Class,Parent_ID,Subscription_ID,Dispatch_Center_ID,LoginName,Address,State,City) VALUES (?,?,?,?,?,?,?,?,?,?)";
            connection.query(SD, [UniqueNo, vv.Name, 1, PI, 1, 1,"SS"+UniqueNo, vv.Address, vv.StateName, vv.CityName], function (err, rows) {
                if (err) throw err;
                else {
                    callback("", "");
                }
            });
        }
    });
};

exports.registerStudent = function (data, callback) {
    var Students = [];

    connection2.query('select id,admission_no,admission_date,first_name,middle_name,last_name,batch_id,date_of_birth,gender,blood_group,birth_place,nationality_id,language,religion,student_category_id,address_line1,city,state,pin_code,country_id,phone1,phone2,email,is_sms_enabled,is_active,is_deleted,created_at,updated_at,has_paid_fees from students', function (error, results, fields) {
        if (error) { throw error; }
        else {
            var vv = JSON.parse(data, true);

            // var UniqueNo = null;
            // if (results.length == 0) {
            //     UniqueNo = 1;
            // }
            // else
            //     UniqueNo = results[results.length - 1].ID + 1;
            var SD = "INSERT INTO students (admission_no,admission_date,first_name,middle_name,last_name,batch_id,date_of_birth,gender,blood_group,birth_place,nationality_id,language,religion,student_category_id,address_line1,city,state,pin_code,country_id,phone1,phone2,email,is_sms_enabled,is_active,is_deleted,created_at,updated_at,has_paid_fees) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            connection2.query(SD, [vv.admission_no,
                                    vv.admission_date,
                                    vv.first_name,
                                    vv.middle_name,
                                    vv.last_name,
                                    vv.batch_id,
                                    vv.date_of_birth,
                                    vv.gender,
                                    vv.blood_group,
                                    vv.birth_place,
                                    vv.nationality_id,
                                    vv.language,
                                    vv.religion,
                                    vv.student_category_id,
                                    vv.address_line1,
                                    vv.city,
                                    vv.state,
                                    vv.pin_code,
                                    vv.country_id,
                                    vv.phone1,
                                    vv.phone2,
                                    vv.email,
                                    vv.is_sms_enabled,
                                    vv.is_active,
                                    vv.is_deleted,
                                    vv.created_at,
                                    vv.updated_at,
                                    vv.has_paid_fees], function (err, rows) {
                if (err) throw err;
                else {
                    callback("", "");
                }
            });
        }
    });
};

exports.SavesParentsInformation = function (data, callback) {
    
    connection.query('select * from parents', function (error1, results, fields) {
        if (error1) {

        }
        else {
            var vv = JSON.parse(data, true);
            var IDTOADD = results[results.length - 1].ID + 1;
            var ss = "INSERT INTO parents (ID,Name,No_Of_Students,Email,Contact) VALUES (?,?,?,?,?)";
            connection.query(ss, [IDTOADD, vv.ParentsName, 1, vv.ParentEmail, vv.ParentContact], function (err, rows) {
                if (err) {
                    callback("", err);
                }
                else {
                    callback(IDTOADD);
                }
            });
        }
    });//Qeury
};

exports.IsLoginCredentialsExists = function (userName, passWord, callback) {
    
    var d1 = JSON.parse(userName);
    var d2 = JSON.parse(passWord);
    
    if (d1 != undefined && d1 != null && d2 != undefined && d2 != null) {
        if (d1 === 'wadmin' && d2 === 'aaaaa') {
            callback('true');
        }
        else {
            callback('false');
        }
    }
}


var Student = function (StudId, Address, Name, ParentsName, CityName,StateName, ParentContact, ParentEmail,DriverContact) {
    this.StudId = StudId;
    this.Address = Address;
    this.Name = Name;
    this.ParentsName = ParentsName;
    this.StateName = StateName;
    this.CityName = CityName;
    this.ParentContact = ParentContact;
    this.ParentEmail = ParentEmail;
    //this.INTime = INTime;
    //this.OUTTime = OUTTime;
    this.DriverContact = DriverContact
}

var Student2 = function (id,admission_no,admission_date,first_name,middle_name,last_name,batch_id,date_of_birth,gender,blood_group,birth_place,nationality_id,language,religion,student_category_id,address_line1,city,state,pin_code,country_id,phone1,phone2,email,is_sms_enabled,is_active,is_deleted,created_at,updated_at,has_paid_fees) {
this.id = id;
this.admission_no = admission_no;
this.admission_date = admission_date;
this.first_name = first_name;
this.middle_name = middle_name;
this.last_name = last_name;
this.batch_id = batch_id;
this.date_of_birth = date_of_birth;
this.gender = gender;
this.blood_group = blood_group;
this.birth_place = birth_place;
this.nationality_id = nationality_id;
this.language = language;
this.religion = religion;
this.student_category_id = student_category_id;
this.address_line1 = address_line1;
this.city = city;
this.state = state;
this.pin_code = pin_code;
this.country_id = country_id;
this.phone1 = phone1;
this.phone2 = phone2;
this.email = email;
this.is_sms_enabled = is_sms_enabled;
this.is_active = is_active;
this.is_deleted = is_deleted;
this.created_at = created_at;
this.updated_at = updated_at;
this.has_paid_fees = has_paid_fees;
}

var Parent = function (PID, PName, PNoOfStudents, PEmail , PContact) {
    this.PID = PID;
    this.PName = PName;
    this.PNoOfStudents = PNoOfStudents;
    this.PEmail = PEmail;
    this.PContact = PContact;
}

var stateInfo = function (stateID, stateName) {
    this.stateID = stateID;
    this.stateName = stateName
}

var cityInfo = function (cityid, cityName, stateID) {
    this.cityid = cityid;
    this.cityName = cityName;
    this.stateID = stateID;
}

var countryInfo = function (id, name) {
    this.id = id;
    this.name = name;
}


//exports.IsLoginCredentialsExists = function (userName, PhoneNumber, callback) {

//    var d1 = JSON.parse(userName);

//    //connection.query('select * from parents where Name = ?', JSON.parse(userName, true), function (error, results, fields) {
//    connection.query('Select Parent_ID from students where ID = ?', d1, function (error, results, fields) {

//        if (error) { throw error; }
//        else {
//            //var CC=JSON.parse(re)
//            connection.query('Select Contact from parents where ID = ?', d1, function (error1, results1, fields) {
//                if (error1) { throw error1; }
//                else {
//                    var dd = results1;
//                    if (dd[0].Contact === JSON.parse(PhoneNumber, true)) {
//                        callback('true');
//                    }
//                    else {
//                        callback('false');
//                    }
//                }
//            });
//        }
//    });
//}

//exports.IsLoggedUserAdmin = function (userName, PhoneNumber, callback) {

//    var d1 = JSON.parse(userName);
//    //connection.query('select * from parents where Name = ?', JSON.parse(userName, true), function (error, results, fields) {
//    connection.query('Select Parent_ID from students where ID = ?', d1, function (error, results, fields) {

//        if (error) { throw error; }
//        else {
//            //var CC=JSON.parse(re)
//            connection.query('Select IsAdmin from parents where ID = ?', d1, function (error1, results1, fields) {
//                if (error1) { throw error1; }
//                else {
//                    var dd = results1;
//                    if (dd[0].Contact === 'true') {
//                        callback('true');
//                    }
//                    else {
//                        callback('false');
//                    }
//                }
//            });
//        }
//    });
//}
var busStopInfo = function (id, name, lat, lng, time, kidsstop, stPt) {
    this.id = id;
    this.StopName = name;
    this.Latitude = lat;
    this.Longitude = lng;
    this.ScheduledTime = time;
    this.kidsstop = kidsstop;
    this.BusStartingPoint = stPt;
};
exports.getRoute = function (data, callback) {
    var route_id = JSON.parse(data, true).routeId;
    var route_info_results = [];
    var bus_route_results = [];
    var list = [];
    connection2.query("select * from bus_route_info where bus_route_id=?", route_id, function (error, results, fields) {
        if (error)
            throw error;
        else {
            route_info_results = results;
            list.push(route_info_results);
            connection2.query("SELECT bus_route.bus_stop_id, bus_stop_info.bus_stop_name, bus_stop_info.lat, bus_stop_info.lng, bus_route.bus_schedule_time FROM bus_route inner join bus_stop_info on bus_route.bus_stop_id=bus_stop_info.bus_stop_id where bus_route_id = ? order by bus_schedule_time", route_id, function(error, results, fields) {
                if (error)
                    throw error;
                else {
                    for (var i = 0; i < results.length; i++) {
                        list.push(new busStopInfo(results[i].bus_stop_id, results[i].bus_stop_name, results[i].lat, results[i].lng, results[i].bus_schedule_time, false, i==0?true:false ));
                    }
                    data = list;
                    callback(data);
                }
            });
        }
    });
};

exports.getUserRoute = function (data, callback) {
    var lData = JSON.parse(data, true);
    var route_id = lData.routeId;
    var stud_id = lData.studId;
    var stop_id = 0;
    var list = [];
    connection2.query("select * from bus_route_info where bus_route_id=?", route_id, function (error, results, fields) {
        if (error)
            throw error;
        else {
            list.push(results);
            //stop_id = getUserStopId(stud_id);
            //console.log(stop_id);
            var sq = "SELECT bus_route.bus_stop_id, bus_stop_info.bus_stop_name, bus_stop_info.lat, bus_stop_info.lng, bus_route.bus_schedule_time FROM bus_route inner join bus_stop_info on bus_route.bus_stop_id=bus_stop_info.bus_stop_id where bus_route_id = ? order by bus_schedule_time; select bus_stop_id from bus_stop_student_assignment where stud_id = ?";
            connection2.query(sq, [route_id, stud_id], function(error, results, fields) {
                if (error) throw error;
                else {
                    console.log(results[0]);
                    console.log(results[1]);
                    for (var i = 0; i < results[0].length; i++) {
                        list.push(new busStopInfo(results[0][i].bus_stop_id, results[0][i].bus_stop_name, results[0][i].lat, results[0][i].lng, results[0][i].bus_schedule_time, results[0][i].bus_stop_id===results[1][0].bus_stop_id?true:false, i==0?true:false ));
                    }
                    data = list;
                    callback(data);
                }
            });
        }
    });
};

// findRouteIndex = function (results, id) {
//     var retVal = 0;
//     var i = 0;
//     var len = results.length;
//     for(i = 0; i < len; i++) {
//         if(results[i].bus_stop_id === id)
//             retVal = i;
//     }
//     return retVal;
// }
//
// findRouteFirstStop = function (results) {
//     var retVal = 0;
//     var i = 0;
//     var len = results.length;
//     for(i = 0; i < len; i++) {
//         if(results[i].bus_stop_id === id)
//             retVal = i;
//     }
//     return retVal;
// }
exports.getRouteList = function (data, callback) {
    connection2.query("select * from bus_route_info", function (error, results, fields) {
        if (error)
            throw error;
        else {
            data = results;
            callback(data);
        }
    });
};

exports.saveRoute = function (data, callback) {
    var lData = JSON.parse(data, true);

    //console.log(lData);
    if(lData.waypoints.length > 0){
        console.log("lat:" + lData.start.lat + " lng:" + lData.start.lng);

        for(var i = 0; i < lData.waypoints.length; i++) {
            console.log("lat:" + lData.waypoints[i].latEnd + " lng:" + lData.waypoints[i].lngEnd + " Name:" + lData.waypoints[i].stopName + "ScheduledTime" + lData.waypoints[i].schedTime);
        }
        console.log("lat:" + lData.end.lat + " lng:" + lData.end.lng);

        var SD = "INSERT INTO bus_route_info (route_name,route_description) VALUES (?,?)";
        var rndNum = Math.floor((Math.random()*6)+1);
        connection2.query(SD, [lData.name, lData.description], function (err, route) {
            if (err) throw err;
            else {
                console.log(route.insertId)
                var SD = "INSERT INTO bus_stop_info (bus_stop_name,bus_stop_description,lat,lng) VALUES (?,?,?,?)";
                var SD2 = "INSERT INTO bus_route (bus_route_id,bus_stop_id,bus_schedule_time) VALUES (?,?,?)";
                connection2.query(SD, ["Start Bus Route" + route.insertId, "This is test route " + route.insertId, lData.start.lat, lData.start.lng], function (err, busstop) {
                    if (err) throw err;
                    else {
                        console.log(busstop.insertId)
                        connection2.query(SD2, [route.insertId, busstop.insertId, "7:30"], function (err, results00) {
                            if (err) throw err;
                            else {
                                console.log(results00.insertId)
                            }
                        });
                    }
                });
                for(var i = 0; i < lData.waypoints.length; i++)
                {
/*                    if(i == 0) {
                        connection2.query(SD, ["Bus Route" + route.insertId, "This is test route " + route.insertId, lData.start.lat, lData.start.lng], function (err, busstop) {
                            if (err) throw err;
                            else {
                                console.log(busstop.insertId)
                                connection2.query(SD2, [route.insertId, busstop.insertId, "7:30"], function (err, results00) {
                                    if (err) throw err;
                                    else {
                                        console.log(results00.insertId)
                                    }
                                });
                            }
                        });
                    }*/
/*                    else if(i == (lData.waypoints.length + 1)) {
                        connection2.query(SD, ["Bus Route" + route.insertId, "This is test route " + route.insertId, lData.end.lat, lData.end.lng], function (err, busstop) {
                            if (err) throw err;
                            else {
                                console.log(busstop.insertId)
                                connection2.query(SD2, [route.insertId, busstop.insertId, "8:30"], function (err, results00) {
                                    if (err) throw err;
                                    else {
                                        console.log(results00.insertId)
                                    }
                                });
                            }
                        });
                    }
                    else {*/
                        //console.log(lData.waypoints[i])
/*                        connection2.query(SD, [lData.waypoints[i].stopName, "This is test route " + route.insertId, lData.waypoints[i].latEnd, lData.waypoints[i].lngEnd], function (err, busstop) {
                            if (err) throw err;
                            else {
                                console.log(busstop.insertId)
                                //console.log(lData.waypoints[i])
                                //console.log(i)
                                connection2.query(SD2, [route.insertId, busstop.insertId, lData.waypoints[i].schedTime], function (err, results00) {
                                    if (err) throw err;
                                    else {
                                        console.log(results00.insertId)
                                    }
                                });
                            }
                        });*/
                    connection2.query(SD, [lData.waypoints[i].stopName, "This is test route " + route.insertId, lData.waypoints[i].latEnd, lData.waypoints[i].lngEnd],
                        (function(i){
                            return function(err, busstop, fields) {
                                console.log(busstop.insertId)
                                connection2.query(SD2, [route.insertId, busstop.insertId, lData.waypoints[i].schedTime], function (err, results00) {
                                    if (err) throw err;
                                    else {
                                        console.log(results00.insertId)
                                    }
                                });
                            };
                        })(i));
                    //}

                }
                connection2.query(SD, ["End Bus Route" + route.insertId, "This is test route " + route.insertId, lData.end.lat, lData.end.lng], function (err, busstop) {
                    if (err) throw err;
                    else {
                        console.log(busstop.insertId)
                        connection2.query(SD2, [route.insertId, busstop.insertId, "8:30"], function (err, results00) {
                            if (err) throw err;
                            else {
                                console.log(results00.insertId)
                            }
                        });
                    }
                });

                callback("", "");
                }
                });

            }
            else {
        callback("", "");

    }





    // Or using Promise
/*    geocoder.reverse({lat:lData.start.lat, lon:lData.start.lng})
        .then(function(res) {
            console.log(res[0].formattedAddress);
        })
        .catch(function(err) {
            console.log(err);
        });
    geocoder.reverse({lat:lData.end.lat, lon:lData.end.lng})
        .then(function(res) {
            console.log(res[0].formattedAddress);
        })
        .catch(function(err) {
            console.log(err);
        });*/
/*
    for(var i = 0; i < lData.waypoints.length-1; i++)
    {
        geocoder.reverse({lat:lData.waypoints[i].latEnd, lon:lData.waypoints[i].lngEnd})
            .then(function(res) {
                console.log(res[0].formattedAddress);
            })
            .catch(function(err) {
                console.log(err);
            });
    }
*/
/*
    connection2.query("select * from bus_route_info", function (error, results, fields) {
        if (error)
            throw error;
        else {
            data = results;
            callback(data);
        }
    });
*/
    //callback("", "");
};