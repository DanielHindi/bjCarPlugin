'use strict';

(function (angular, window) {
    angular
        .module('auctionPluginWidget')
        .controller('WidgetAuctionCtrl', ['$scope', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", '$routeParams', '$sce', '$location', '$rootScope',
            function ($scope, Buildfire, TAG_NAMES, ERROR_CODE, Location, $routeParams, $sce, $location, $rootScope) {
                var WidgetAuction = this;
                var currentItemLayout,
                    currentListLayout;
                var DEFAULT_LIST_LAYOUT = 'list-layout-1',
                    DEFAULT_ITEM_LAYOUT = 'item-layout-1';
                WidgetAuction.defaults = {
                    DEFAULT_LIST_LAYOUT: 'list-layout-1',
                    DEFAULT_ITEM_LAYOUT: 'item-layout-1',
                    DEFAULT_SORT_OPTION: "Oldest to Newest"
                };
                var breadCrumbFlag = true;

                buildfire.history.get('pluginBreadcrumbsOnly', function (err, result) {
                    if(result && result.length) {
                        result.forEach(function(breadCrumb) {
                            if(breadCrumb.label == 'Person') {
                                breadCrumbFlag = false;
                            }
                        });
                    }
                    if(breadCrumbFlag) {
                        buildfire.history.push('Person', { elementToShow: 'Person' });
                    }
                });

                /*
                 Send message to Control that this page has been opened
                 */
                var _searchObj = $location.search();
                if ($routeParams.id && !_searchObj.stopSwitch) {
                    $routeParams.showHome = false;
                    console.log($location.search());
                    buildfire.messaging.sendMessageToControl({id: $routeParams.id, type: 'OpenItem'});
                }
                $rootScope.showHome = false;
                /*declare the device width heights*/
                WidgetAuction.deviceHeight = window.innerHeight;
                WidgetAuction.deviceWidth = window.innerWidth;

                /*initialize the device width heights*/
                var initDeviceSize = function (callback) {
                    WidgetAuction.deviceHeight = window.innerHeight;
                    WidgetAuction.deviceWidth = window.innerWidth;
                    if (callback) {
                        if (WidgetAuction.deviceWidth == 0 || WidgetAuction.deviceHeight == 0) {
                            setTimeout(function () {
                                initDeviceSize(callback);
                            }, 500);
                        } else {
                            callback();
                            if (!$scope.$$phase && !$scope.$root.$$phase) {
                                $scope.$apply();
                            }
                        }
                    }
                };

                /*crop image on the basis of width heights*/
                WidgetAuction.cropImage = function (url, settings) {
                    var options = {};
                    if (!url) {
                        return "";
                    }
                    else {
                        if (settings.height) {
                            options.height = settings.height;
                        }
                        if (settings.width) {
                            options.width = settings.width;
                        }
                        return Buildfire.imageLib.cropImage(url, options);
                    }
                };

                WidgetAuction.safeHtml = function (html) {
                    if (html)
                        return $sce.trustAsHtml(html);
                };

                var getAuctionDetail = function () {

                    $rootScope.showHome = false;
                    WidgetAuction.item = window.auction.items[$routeParams.id];

                    WidgetAuction.item.images.forEach(function(img){
                        img.crop_url = buildfire.imageLib.cropImage(img.fullsize_url,{width:'full',height:235});
                    });

                    $scope.$digest();
                    bindOnUpdate();

                    setTimeout(triggerKB,50);

                };
                var getContentAuctionInfo = function () {
                    Buildfire.datastore.get(TAG_NAMES.AUCTION_INFO, function (err, result) {

                        if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                            return console.error('-----------err-------------', err);
                        }
                        if (result && result.data) {
                            WidgetAuction.data = result.data;
                            if (!WidgetAuction.data.content) {
                                WidgetAuction.data.content = {
                                    sortBy: WidgetAuction.defaults.DEFAULT_SORT_OPTION
                                }
                            }
                            if (!WidgetAuction.data.design) {
                                WidgetAuction.data.design = {
                                    itemLayout: WidgetAuction.defaults.DEFAULT_ITEM_LAYOUT,
                                    listLayout: WidgetAuction.defaults.DEFAULT_LIST_LAYOUT
                                };
                            } else {
                                currentItemLayout = WidgetAuction.data.design.itemLayout;
                                currentListLayout = WidgetAuction.data.design.listLayout;
                            }
                            $scope.$digest();
                        } else {
                            throw ("Error with cars plugin.");
                        }

                        getAuctionDetail();
                    });
                };
                getContentAuctionInfo();
                function bindOnUpdate() {
                    WidgetAuction.onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
                        console.log("Hello--------1")
                        if (event && event.tag) {
                            switch (event.tag) {
                                case TAG_NAMES.AUCTION:
                                    console.log('Auction iNfo updated-----------------', event.data);
                                    $rootScope.$broadcast('Item_Updated', event);
                                    if (event.data)
                                        WidgetAuction.item = event.data;
                                    break;
                                case TAG_NAMES.AUCTION_INFO:
                                    WidgetAuction.data = event.data;
                                    if (event.data.design.backgroundImage) {
                                        $rootScope.backgroundImage = event.data.design.backgroundImage;
                                    }
                                    else {
                                        $rootScope.backgroundImage = ""
                                    }
                                    if (event.data.design.itemLayout && currentItemLayout != event.data.design.itemLayout) {
                                        WidgetAuction.data.design.itemLayout = event.data.design.itemLayout;
                                        currentItemLayout = event.data.design.itemLayout;

                                    }
                                    else if (event.data.design.listLayout && currentListLayout != event.data.design.listLayout) {
                                        Location.goToHome();
                                    }
                                    break;
                            }
                            $scope.$digest();
                        }
                    });
                }

                $scope.$on("$destroy", function () {
                    WidgetAuction.onUpdateFn.clear();

                    $rootScope.$broadcast('ROUTE_CHANGED', WidgetAuction.data.design.listLayout, WidgetAuction.data.design.itemLayout, WidgetAuction.data.design.backgroundImage, WidgetAuction.data);
                });
                WidgetAuction.openLinks = function (actionItems) {
                    if (actionItems && actionItems.length) {
                        var options = {};
                        var callback = function (error, result) {
                            if (error) {
                                console.error('Error:', error);
                            }
                        };
                        buildfire.actionItems.list(actionItems, options, callback);
                    }
                }
                Buildfire.datastore.onRefresh(function(){

                    getAuctionDetail();
                  });
            }])
})(window.angular, window);
