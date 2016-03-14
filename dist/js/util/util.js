/**
 * Created by chenmingkang on 16/1/15.
 */
;(function(angular){
    angular.inArray = function( elem, arr, i ) {
        var len;
        var deletedIds = [];
        var indexOf = deletedIds.indexOf;
        if ( arr ) {
            if ( indexOf ) {
                return indexOf.call( arr, elem, i );
            }
            len = arr.length;
            i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
            for ( var i = 0; i < len; i++ ) {
                if ( i in arr && arr[ i ] === elem ) {
                    return i;
                }
            }
        }

        return -1;
    };

    angular.param = function(obj) {
        if ( ! angular.isObject( obj) ) {
            return( ( obj== null ) ? "" : obj.toString() );
        }
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {

            value = obj[name];
            if(value instanceof Array) {
                for(i in value) {

                    subValue = value[i];
                    fullSubName = name + '[]';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += arguments.callee(innerObj) + '&';
                }

            } else if(value instanceof Object) {
                for(subName in value) {

                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += arguments.callee(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };


    angular.isObjectValueEqual = function(a, b) {
        // Of course, we can do it use for in
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    };

    return angular;

})(angular || {});