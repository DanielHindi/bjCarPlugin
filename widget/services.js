'use strict';

(function (angular, buildfire, location) {
    //created mediaCenterWidget module
    angular
        .module('auctionWidgetServices', ['auctionEnums'])
        .provider('Buildfire', [function () {
            this.$get = function () {
                return buildfire;
            }
        }])
        .provider('ImageLib', [function () {
            this.$get = function () {
                return buildfire.imageLib;
            }
        }])
        .factory("DB", ['Buildfire', '$q','$http', 'MESSAGES', 'CODES', function (Buildfire, $q, $http,MESSAGES, CODES) {
            function DB(tagName) {
                this._tagName = tagName;
            }

            DB.prototype.get = function () {
                var that = this;
                var deferred = $q.defer();

                Buildfire.datastore.get(that._tagName, function (err, result) {
                    if (err && err.code == CODES.NOT_FOUND) {
                        return deferred.resolve();
                    }
                    else if (err) {
                        return deferred.reject(err);
                    }
                    else {
                        return deferred.resolve(result);
                    }
                });
                return deferred.promise;
            };
            DB.prototype.getById = function (id) {
                var that = this;
                var deferred = $q.defer();
                debugger;
                Buildfire.datastore.getById(id, that._tagName, function (err, result) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    else if (result && result.data) {
                        return deferred.resolve(result);
                    } else {
                        return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOND));
                    }
                });
                return deferred.promise;
            };

            DB.prototype.find = function (options) {
                var that = this;
                var deferred = $q.defer();
                debugger;
                if (typeof options == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.OPTION_REQUIRES));
                }
                Buildfire.datastore.search(options, that._tagName, function (err, result) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    else if (result) {
                        return deferred.resolve(result);
                    } else {
                        return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOUND));
                    }
                });
                return deferred.promise;
            };

            DB.prototype.clearListener = function () {
                var that = this;
                var deferred = $q.defer();
                debugger;
                if (typeof id == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.ID_NOT_DEFINED));
                }
                onUpdateListeners.forEach(function (listner) {
                    listner.clear();
                });
                onUpdateListeners = [];

                return deferred.promise;
            };
            return DB;
        }])
        .factory('Utility', [function () {

        }])

})(window.angular, window.buildfire, window.location);
