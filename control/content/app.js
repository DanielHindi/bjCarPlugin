'use strict';

(function (angular, buildfire) {
    //created auctionPluginContent module
    angular
        .module('auctionPluginContent', [
            'auctionEnums',
            'auctionFiltersContent',
            'auctionServices',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'ui.sortable',
            'infinite-scroll',
            "ui.tinymce"
            ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        .constant('TAG_NAMES', {
            AUCTION_INFO: 'auctionInfo',
            CARS: 'cars'
        })
        .constant('ERROR_CODE', {
            NOT_FOUND: 'NOTFOUND'
        })
        .constant('STATUS_CODE', {
            INSERTED: 'inserted',
            UPDATED: 'updated'
        })
        .constant('SORT', {
            MANUALLY: 'Manually',
            OLDEST_TO_NEWEST: 'Oldest to Newest',
            NEWEST_TO_OLDEST: 'Newest to Oldest',
            FIRST_NAME_A_TO_Z: 'First Name A-Z',
            FIRST_NAME_Z_TO_A: 'First Name Z-A',
            LAST_NAME_A_TO_Z: 'Last Name A-Z',
            LAST_NAME_Z_TO_A: 'Last Name Z-A',
            _limit: 10,
            _maxLimit: 19,
            _skip: 0
        })
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'ContentHome',
                    controller: 'ContentHomeCtrl',
                    resolve: {
                        AuctionInfo: ['$q', 'DB', 'COLLECTIONS', 'Location', function ($q, DB, COLLECTIONS, Location) {

                            var deferred = $q.defer();
                            var auctionInfo = new DB(COLLECTIONS.auctionInfo);
                            /*    var _bootstrap = function () {
                             auctionInfo.save({
                             content: {
                             images: [],
                             description: '',
                             sortBy: "Manually",
                             rankOfLastItem: 0
                             },
                             design: {
                             itemLayout: "item-layout-1",
                             listLayout: "list-layout-1",
                             backgroundImage: ''
                             }
                             }).then(function success() {
                             Location.goToHome();
                             }, function fail() {
                             _bootstrap();
                             })
                             };*/
                            auctionInfo.get().then(function success(result) {
                                    if (result && result.data && result.data.content && result.data.design) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        //error in bootstrapping
                                        //_bootstrap(); //bootstrap again  _bootstrap();
                                        deferred.resolve({
                                            data: {
                                                content: {
                                                    images: [],
                                                    description: '',
                                                    sortBy: "Manually",
                                                    rankOfLastItem: 0
                                                },
                                                design: {
                                                    itemLayout: "item-layout-1",
                                                    listLayout: "list-layout-1",
                                                    backgroundImage: ''
                                                }
                                            }
                                        });
                                    }
                                },
                                function fail() {
                                    Location.goToHome();
                                }
                            );
                            return deferred.promise;
                        }]
                    }
                })
                .when('/cars', {
                    templateUrl: 'templates/cars.html',
                    controllerAs: 'ContentAuction',
                    controller: 'ContentAuctionCtrl'
                })
                .when('/cars/:itemId', {
                    templateUrl: 'templates/cars.html',
                    controllerAs: 'ContentAuction',
                    controller: 'ContentAuctionCtrl'
                })
                .otherwise('/');
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }])
        .factory('Location', [function () {
            var _location = window.location;
            return {
                goTo: function (path) {
                    _location.href = path;
                },
                goToHome: function () {
                    _location.href = _location.href.substr(0, _location.href.indexOf('#'));
                }
            };
        }])
        .factory('RankOfLastItem', [function () {
            var _rankOfLastItem;
            return {
                getRank: function () {
                    return _rankOfLastItem;
                },
                setRank: function (value) {
                    _rankOfLastItem = value;
                }
            };
        }])
        .filter('getImageUrl', function () {
            return function (url, width, height, type) {
                if (type == 'resize')
                    return buildfire.imageLib.resizeImage(url, {
                        width: width,
                        height: height
                    });
                else
                    return buildfire.imageLib.cropImage(url, {
                        width: width,
                        height: height
                    });
            }
        })
        .run(['Location', 'Buildfire', function (Location, Buildfire) {
// Handler to receive message from widget
            buildfire.messaging.onReceivedMessage = function (msg) {
                console.log(msg.type, window.location.href, msg.id);
                switch (msg.type) {
                    case 'OpenItem':
                        Location.goTo("#/cars/" + msg.id);
                        break;
                    default:
                        Buildfire.history.pop();
                        Location.goToHome();
                }
            };
            Buildfire.history.onPop(function (data, err) {
                if (data && data.label != 'Person')
                    Location.goToHome();
                console.log('Buildfire.history.onPop called--------------------------------------------', data, err);
            });
        }]);
})(window.angular, window.buildfire);
