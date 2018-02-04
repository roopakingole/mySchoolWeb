function ConfirmMsgCtrl($scope, $dialog) {

    var dialogOptions = {
        controller: 'ConfirmMsgCtrlActual',
        templateUrl: 'confirmDialog.html'
    };

    $scope.showConfirmMsg = function(){

        $dialog.dialog(angular.extend(dialogOptions))
            .open()
            .then(function(result) {
                if(result) {
                    //angular.copy(result, itemToEdit);
                }
                //itemToEdit = undefined;
            });
    };
}
// the dialog is injected in the specified controller
function ConfirmMsgCtrlActual($scope, dialog){

    $scope.confirmYes = function() {
        dialog.close(undefined);
    };

    $scope.confirmNo = function(){
        dialog.close(undefined);
    };
}