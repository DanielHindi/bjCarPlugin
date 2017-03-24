(function (angular) {
    angular
        .module('auctionPluginDesign')
        .controller('DesignHomeCtrl', ['$scope', 'Buildfire', 'TAG_NAMES', function ($scope, Buildfire, TAG_NAMES) {
            var DesignHome = this;
            var DesignHomeMaster;
            DesignHome.layouts = {
                listLayouts: [{
                    name: "list-layout-1"
                }, {
                    name: "list-layout-2"
                }],
                itemLayouts: [{
                    name: "item-layout-1"
                }, {
                    name: "item-layout-2"
                }, {
                    name: "item-layout-3"
                }, {
                    name: "item-layout-4"
                }]
            };
            var options = {showIcons: false, multiSelection: false};
            DesignHome.changeListLayout = function (layoutName) {
                if (layoutName && DesignHome.auctionInfo.design) {
                    DesignHome.auctionInfo.design.listLayout = layoutName;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            };
            DesignHome.changeItemLayout = function (layoutName) {
                if (layoutName && DesignHome.auctionInfo.design) {
                    DesignHome.auctionInfo.design.itemLayout = layoutName;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            };


            function init() {
                var auctionInfo = {
                    design: {
                        listLayout: "",
                        itemLayout: "",
                        backgroundImage: ""
                    },
                    content: {
                        images: [],
                        description: ""
                    }
                };
                Buildfire.datastore.get(TAG_NAMES.AUCTION_INFO, function (err, data) {
                    if (err) {
                        Console.log('------------Error in Design of Auction Plugin------------', err);
                    }
                    else if (data && data.data) {
                        DesignHome.auctionInfo = angular.copy(data.data);
                        if (!DesignHome.auctionInfo.design)
                            DesignHome.auctionInfo.design = {};
                        if (!DesignHome.auctionInfo.design.listLayout)
                            DesignHome.auctionInfo.design.listLayout = DesignHome.layouts.listLayouts[0].name;
                        if (!DesignHome.auctionInfo.design.itemLayout)
                            DesignHome.auctionInfo.design.itemLayout = DesignHome.layouts.itemLayouts[0].name;

                        DesignHomeMaster = angular.copy(data.data);
                        if (DesignHome.auctionInfo.design.backgroundImage) {
                            background.loadbackground(DesignHome.auctionInfo.design.backgroundImage);
                        }
                        $scope.$digest();
                    }
                    else {
                        DesignHome.auctionInfo = auctionInfo;
                        console.info('------------------unable to load data---------------');
                    }
                });
            }
            var background = new Buildfire.components.images.thumbnail("#background");

            background.onChange = function (url) {
                DesignHome.auctionInfo.design.backgroundImage = url;
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            };

            background.onDelete = function (url) {
                DesignHome.auctionInfo.design.backgroundImage = "";
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            };
            init();
            $scope.$watch(function () {
                return DesignHome.auctionInfo;
            }, function (newObj) {
                if (!angular.equals(newObj,DesignHomeMaster)){
                    console.log("hello data1", newObj, DesignHomeMaster)
                    Buildfire.datastore.save(DesignHome.auctionInfo, TAG_NAMES.AUCTION_INFO, function (err, data) {
                        if (err) {
                            console.log("hello error", err)
                            return DesignHome.auctionInfo = angular.copy(DesignHomeMaster);
                        }
                        else if (data) {

                            console.log("hello data", data)
                            return DesignHomeMaster = data.obj;
                        }
                        $scope.$digest();
                    });
                }
            }, true);

        }]);
})(window.angular);