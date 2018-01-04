var mysql = require('mysql')
var sync = require('synchronize');

var connection = mysql.createConnection({
   host     : 'myschooldb.cqpg3lhg6zxx.us-east-2.rds.amazonaws.com',
   user     : 'master',
   password : 'masterschool',
   database : 'myschool'
});


// var connection = mysql.createConnection({
//     host     : 'localhost',
//     port     : '3307',
//     user     : 'root',
//     password : 'foradian',
//     database : 'fedena_ultimate'
// });

connection.connect(function (err) {
    //if (err) throw err
    console.log('You are now connected...')
})

// exports.GetList = function (data, callback) {
//     var Students = [];

//     //connection.query('select id,admission_no,admission_date,first_name,middle_name,last_name,batch_id,date_of_birth,gender,blood_group,birth_place,nationality_id,language,religion,student_category_id,address_line1,city,state,pin_code,country_id,phone1,phone2,email,is_sms_enabled,is_active,is_deleted,created_at,updated_at,has_paid_fees from students', function (error, results, fields) {
//     connection.query('select * from students', function (error, results, fields) {
//         if (error) { throw error; }
//         else {
//             var PP = JSON.parse(data, true);
//             for (var i = 0; i < results.length; i++) {
//                 var PID = results[i].Parent_ID;
//                 var ParentsName;
//                 var ParentsContact;
//                 var ParentsEmail;
//                 for (var j = 0; j < PP.length; j++) {
//                     if (PP[j].PID === PID) {
//                         ParentsName = PP[j].PName;
//                         ParentsContact = PP[j].PContact;
//                         ParentsEmail = PP[j].PEmail;
//                         break;
//                     }
//                 };
                
//                 Students.push(new Student(results[i].ID, results[i].Address, results[i].Name, ParentsName, results[i].City, results[i].State ,ParentsContact, ParentsEmail, "2344555669"));
//                 // Students.push(new Student2(results[i].id,
//                 //                             results[i].admission_no,
//                 //                             results[i].admission_date,
//                 //                             results[i].first_name,
//                 //                             results[i].middle_name,
//                 //                             results[i].last_name,
//                 //                             results[i].batch_id,
//                 //                             results[i].date_of_birth,
//                 //                             results[i].gender,
//                 //                             results[i].blood_group,
//                 //                             results[i].birth_place,
//                 //                             results[i].nationality_id,
//                 //                             results[i].language,
//                 //                             results[i].religion,
//                 //                             results[i].student_category_id,
//                 //                             results[i].address_line1,
//                 //                             results[i].city,
//                 //                             results[i].state,
//                 //                             results[i].pin_code,
//                 //                             results[i].country_id,
//                 //                             results[i].phone1,
//                 //                             results[i].phone2,
//                 //                             results[i].email,
//                 //                             results[i].is_sms_enabled,
//                 //                             results[i].is_active,
//                 //                             results[i].is_deleted,
//                 //                             results[i].created_at,
//                 //                             results[i].updated_at,
//                 //                             results[i].has_paid_fees));
//             };
//             var dd = Students;
//             callback(dd);
//         }
//         //res.end(JSON.stringify(results));;
//     });
// };


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
