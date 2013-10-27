var wtffControllers = angular.module('wtff.controllers', ['wtff.filters', 'wtff.resources']);

wtffControllers.controller('HomeController', ['$scope', '$http','$timeout','$filter',
    function ($scope, $http, $timeout, $filter) {
        var getDiscount = function(amount, percentage){
            return ((parseFloat(amount) * parseFloat(percentage))/100);
        }

        var calSubTotal = function(){
            var i=0, len=$scope.selected.length;
            var discount_total = 0;
            for (; i<len; i++) {
                discount_total += parseFloat($scope.selected[i].discount);
            }
            var discount = getDiscount($scope.amount['base'], discount_total);
            $scope.amount['total'] = parseFloat($scope.amount['base']) - discount;
        }

        $scope.amount = {
            total: 0
        };
        $scope.selected = [];

        $scope.rules = [
            {
                id: '6456465334',
                api_services: "twitter",
                icon: "icon-twitter",
                method: "mention",
                what: "mention",
                discount: "25"
            },
            {
                id: '6456465335',
                api_services: "twitter",
                icon: "icon-twitter",
                method: "hashtag",
                what: "#PruebaBellissima",
                discount: "25"
            },
            {
                id: '6456465336',
                api_services: "facebook",
                icon: "icon-facebook",
                method: "like",
                what: "like",
                discount: "15"
            },
            {
                id: '6456465337',
                api_services: "twitter",
                icon: "icon-twitter",
                method: "follow",
                what: "follow",
                discount: "5"
            }
        ];
        $scope.WebCamBadge = "label label-danger pull-right";
        $scope.WebCamBadgeValue = "inactive";

        $scope.updateAmount = function(){
            //take the base amount and update the total amount with discount if
            //was selected
            $scope.amount['total'] = $scope.amount['base'];
        };
        var webcamSuccess = function(){
            $scope.WebCamBadge = "label label-success pull-right";
            $scope.WebCamBadgeValue = "active";
        };
        $scope.$on('webcamActive',webcamSuccess);


        var webcamFailure = function(){
            $scope.WebCamBadge = "label label-danger pull-right";
            $scope.WebCamBadgeValue = "inactive";
        };
        $scope.$on('webcamInactive',webcamFailure);
        $scope.makingCall = false;
        var motionDetected = function(data){
            $timeout.cancel(scanTimeout);
            $scope.scanningStatus = "icon-spinner icon-spin icon-2x";
            $scope.scanningMessage = "Scanning....";
            var scanTimeout = $timeout(function(){
                $scope.scanningStatus = "icon-pause icon-2x";
                $scope.scanningMessage = "Waiting Motion";
            }, 3000);
            if($scope.makingCall === false){
                $scope.makingCall = true;
                $http.post('/admin/panel/scanner',{params:{photo:$scope.image_scanner}}).success(function(data){
                    if (data.result == true){
                        $scope.makingCall = false;
                        console.log(data.code);
                    }
                });
            }

          console.log("broadcast motion detected");
        };
        $scope.$on('motion',motionDetected);

        $scope.selectDiscount = function(id){
            var discount_selected = $filter('getById')($scope.rules, id);
            //first check if the selected value already exist into the selected array
            var is_selected = $filter('getSelectedId')($scope.selected, discount_selected.id);
            if (is_selected){
                //the discount is already selected, we need to remove it
                console.log("passa delete");
                $scope.selected = $filter('removeSelectedId')($scope.selected, discount_selected);
            }else{
                //the selected discount don't exist
                console.log("passa add");
                $scope.selected = $filter('addSelectedId')($scope.selected, discount_selected);
            }

            calSubTotal();

        };

        $scope.isSelected = function(id){
            return $filter('getSelectedId')($scope.selected, id);
        };

    }]);

wtffControllers.controller('RulesController', ['$scope', '$http','$timeout','apiService',
    function ($scope, $http, $timeout, apiService) {
        $http.get('/admin/rules.json').success(function(data){
            $scope.rules = data.rules;
        });
    }]);

wtffControllers.controller('RulesAddController', ['$scope', '$http','$timeout', '$location', 'apiService',
    function ($scope, $http, $timeout, $location, apiService) {
        $scope.rule = {};
        $scope.twitterMethodsSelect = true;
        $scope.twitterHashTagSelect = true;
        $scope.discountSelect = true;

        var closeAll = function(){
            $scope.twitterMethodsSelect = true;
            $scope.twitterHashTagSelect = true;
            $scope.discountSelect = true;
        };

        /*
        actions steps
         */
        $scope.openTwitterOptions = function(){
            closeAll();
            $scope.rule = {};
            $scope.rule.api_services = "twitter";
            $scope.rule.icon = "icon-twitter";
            $scope.twitterMethodsSelect = false;
        };

        $scope.setTwitterMethod = function(method){
            closeAll();
            $scope.rule.method = method;
            if(method=="hashtag"){
                //open the hastag div
                $scope.twitterHashTagSelect = false;
            }
            else{
                $scope.rule.what = method;
                $scope.discountSelect = false;
            }
        };

        $scope.openDiscount = function(){
            closeAll();
            $scope.discountSelect = false;
        }

        $scope.completeProcess = function(){
            console.log($scope.rule);
            //set the rules and send to the server
            $http.post('/admin/rules.json', $scope.rule).success(function(data){
                console.log(data);
            });

            $location.path("/rules");
        }
        
    }]);

wtffControllers.controller('SubscriptionsController', ['$scope', '$http','$timeout',
    function ($scope, $http, $timeout) {

    }]);