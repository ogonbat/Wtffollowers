var wtffFilters = angular.module('wtff.filters',[]);

wtffFilters.filter('getById', function(){
    return function(input, id) {
        var i=0, len=input.length;
        for (; i<len; i++) {
            if (+input[i].id == +id) {
                return input[i];
            }
        }
        return null;
    }
});

wtffFilters.filter('getSelectedId', function(){
    return function(input, id) {
        var i=0, len=input.length;
        for (; i<len; i++) {
            if (+input[i].id == +id) {
                return true;
            }
        }
        return false;
    }
});

wtffFilters.filter('addSelectedId', function(){
    return function(input, object_id) {
        var id = object_id.id;
        var i=0, len=input.length;
        for (; i<len; i++) {
            if (+input[i].id == +id) {
                return input;
            }
        }
        input.push(object_id);
        return input;
    }
});

wtffFilters.filter('removeSelectedId', function(){
    return function(input, object_id) {
        var id = object_id.id;
        var i=0, len=input.length;

        for (; i<len; i++) {

            if (+input[i].id == +id) {
                input.splice(i,1);
                return input;
            }
        }

        return input;
    }
});
