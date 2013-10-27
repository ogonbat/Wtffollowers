var wtffResources = angular.module("wtff.resources",['ngResource']);

wtffResources.factory('apiService',['$resource',function($resource){
   return {
       Rules: $resource('/admin/rules/:ruleId.json',{ruleId:'@id'}, {})
   }
}]);
