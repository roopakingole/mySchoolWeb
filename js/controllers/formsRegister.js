//mySchoolForms.js
//var webapiUrl = 'http://ec2-13-59-22-248.us-east-2.compute.amazonaws.com:1337/employees';
var webapiUrl = 'http://127.0.0.1:1337/employees';

angular
.module('app', ['ngMaterial'])
    .controller('studentRegistrationCtrl', ['$scope','$http', '$filter', '$mdDialog', function($scope, $http, $filter, $mdDialog) {
      this.http = $http;
      this.studentInfo = {};
      $scope.myself = this;
      $scope.countryList = {};
      $scope.existingStudents = {};
      $scope.status = "This is test";
      $scope.items = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];
      $http.get(webapiUrl + '/getCountryList').
      then(function(response) {
            $scope.status = response.status;
            $scope.countryList = response.data;
        });

      $http.get(webapiUrl + '/ShowInfo2').
      then(function(response) {
          $scope.status2 = response.status;
          $scope.existingStudents = response.data;
          $scope.myself.studentInfo.admission_no = parseInt($scope.existingStudents[$scope.existingStudents.length-1].admission_no,10) + 1;
      });

      this.studentInfo.admission_no = 0;
      this.studentInfo.admission_date = Date.now();
      this.studentInfo.first_name = "";
      this.studentInfo.middle_name = "";
      this.studentInfo.last_name = "";
      this.studentInfo.batch_id = 0;
      this.studentInfo.date_of_birth = 0;
      this.studentInfo.gender = "";
      this.studentInfo.blood_group = "";
      this.studentInfo.blood_group_list = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];
      this.studentInfo.birth_place = "";
      this.studentInfo.nationality_id = 0;
      this.studentInfo.language = "";
      this.studentInfo.religion = "";
      this.studentInfo.student_category_id = 0;
      this.studentInfo.address_line1 = "";
      this.studentInfo.address_line2 = "";
      this.studentInfo.city = "";
      this.studentInfo.state = "";
      this.studentInfo.pin_code = "";
      this.studentInfo.country_id = 0;
      this.studentInfo.phone1 = "";
      this.studentInfo.phone2 = "";
      this.studentInfo.email = "";
      this.studentInfo.is_sms_enabled = false;
      this.studentInfo.is_active = false;
      this.studentInfo.is_deleted = false;
      this.studentInfo.created_at = Date.now();
      this.studentInfo.updated_at = Date.now();
      this.studentInfo.has_paid_fees = false;

      this.submit = function(){

          var student = {
              Name: this.studentInfo.first_name + " " + this.studentInfo.middle_name + " " + this.studentInfo.last_name,
              ParentsName: this.studentInfo.middle_name + " " + this.studentInfo.last_name,
              StateName: this.studentInfo.state,
              CityName: this.studentInfo.city,
              ParentContact: this.studentInfo.phone1,
              ParentEmail: this.studentInfo.email,
              Driver_ID: "1",
              Address: this.studentInfo.address_line1 + this.studentInfo.address_line2
          };
          var student2 = {
              admission_no: this.studentInfo.admission_no,
              admission_date: $filter('date')(this.studentInfo.admission_date, "yyyy-MM-dd"),
              first_name: this.studentInfo.first_name,
              middle_name: this.studentInfo.middle_name,
              last_name: this.studentInfo.last_name,
              batch_id: this.studentInfo.batch_id,
              date_of_birth: $filter('date')(this.studentInfo.date_of_birth, "yyyy-MM-dd"),
              gender: this.studentInfo.gender,
              blood_group: this.studentInfo.blood_group,
              birth_place: this.studentInfo.birth_place,
              nationality_id: this.studentInfo.nationality_id,
              language: this.studentInfo.language,
              religion: this.studentInfo.religion,
              student_category_id: this.studentInfo.student_category_id,
              address_line1: this.studentInfo.address_line1,
              city: this.studentInfo.city,
              state: this.studentInfo.state,
              pin_code: this.studentInfo.pin_code,
              country_id: this.studentInfo.country_id,
              phone1: this.studentInfo.phone1,
              phone2: this.studentInfo.phone2,
              email: this.studentInfo.email,
              is_sms_enabled: this.studentInfo.is_sms_enabled,
              is_active: this.studentInfo.is_active,
              is_deleted: this.studentInfo.is_deleted,
              created_at: $filter('date')(this.studentInfo.created_at, "yyyy-MM-dd HH:mm:ss"),
              updated_at: $filter('date')(this.studentInfo.updated_at, "yyyy-MM-dd HH:mm:ss"),
              has_paid_fees: this.studentInfo.has_paid_fees
          };
          var lStatus =  $http({
              method: "POST",
              url: 'http://localhost:1337/employees/saveinformation',
              params: {
                  "SS": JSON.stringify(student)
              }
          });
          var lStatus2 =  $http({
              method: "POST",
              url: 'http://localhost:1337/employees/registerStudent',
              params: {
                  "SS": JSON.stringify(student2)
              }
          });
          this.reset();
          $('#exampleModal').modal('show');
      };
      this.reset = function() {
          this.studentInfo.first_name = "";
          this.studentInfo.middle_name = "";
          this.studentInfo.last_name = "";
          this.studentInfo.batch_id = 0;
          this.studentInfo.date_of_birth = 0;
          this.studentInfo.gender = "";
          this.studentInfo.blood_group = "";
          this.studentInfo.birth_place = "";
          this.studentInfo.nationality = 0;
          this.studentInfo.language = "";
          this.studentInfo.religion = "";
          this.studentInfo.student_category = 0;
          this.studentInfo.address_line1 = "";
          this.studentInfo.address_line2 = "";
          this.studentInfo.city = "";
          this.studentInfo.state = "";
          this.studentInfo.pin_code = "";
          this.studentInfo.country = 0;
          this.studentInfo.phone1 = "";
          this.studentInfo.phone2 = "";
          this.studentInfo.email = "";
          this.studentInfo.is_sms_enabled = false;
      };
      this.showModal = function() {
          $('#exampleModal').modal('show');
      }
}]);
