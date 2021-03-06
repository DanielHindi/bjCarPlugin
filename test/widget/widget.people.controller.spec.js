describe('Unit : cars Plugin widget.cars.controller.js when buildfire content and design are defined', function () {
    var WidgetAuction, scope, $rootScope, $controller, Buildfire, TAG_NAMES, ERROR_CODE, Location, $sce, $location, $routeParams;
    beforeEach(module('auctionPluginWidget'));

    beforeEach(module('auctionPluginWidget', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'getById', 'onUpdate', 'onRefresh']);
            this.imageLib = jasmine.createSpyObj('imageLib', ['cropImage']);
            this.imageLib.cropImage.and.callFake(function (url, options) {
                return url;
            });
            this.datastore.get.and.callFake(function (_tagName, callback) {
                if (_tagName) {
                    callback(null, {
                        data: {
                            design: {
                                itemLayout: '',
                                listLayout: ''
                            },
                            content: {
                                sortBy: 'Newest'
                            }
                        }
                    });
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.getById.and.callFake(function (_itemId, _tagName, callback) {
                if (_itemId && _tagName) {
                    callback(null, {
                        data: {
                            design: {
                                itemLayout: '',
                                listLayout: ''
                            },
                            content: {
                                sortBy: 'Newest'
                            }
                        }
                    });
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.onUpdate.and.callFake(function (callback) {
                callback({tag: 'auctionInfo', data: {design: {backgroundImage: 'bg.png', itemLayout: 'layout1',listLayout:'listLayout1'}}});
                return {
                    clear: function () {
                        return true
                    }
                }
            });
        });
    }));

    beforeEach(inject(function (_$rootScope_, _$controller_, _TAG_NAMES_, _ERROR_CODE_, _Location_, _Buildfire_, _$sce_, _$location_, _$routeParams_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Buildfire = _Buildfire_;
        Buildfire.deeplink = {};
        TAG_NAMES = _TAG_NAMES_;
        ERROR_CODE = _ERROR_CODE_;
        Location = jasmine.createSpyObj('Location', ['goTo']);
        Buildfire.deeplink = jasmine.createSpyObj('Buildfire.deeplink', ['getData']);
        $sce = _$sce_;
        $location = _$location_;
        $routeParams = _$routeParams_;
    }));

    beforeEach(function () {
        WidgetAuction = $controller('WidgetAuctionCtrl', {
            $scope: scope,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ERROR_CODE: ERROR_CODE,
            Location: Location,
            $sce: $sce,
            $rootScope: $rootScope,
            $location: $location,
            $routeParams: $routeParams
        });
        WidgetAuction.data = {content: {sortBy:'Newest'}};
    });

    describe('Units: units should be Defined', function () {
        it('Buildfire should be defined and be an object', function () {
            expect(Buildfire).toBeDefined();
            expect(typeof Buildfire).toEqual('object');
        });
        it('TAG_NAMES should be defined and be an object', function () {
            expect(TAG_NAMES).toBeDefined();
            expect(typeof TAG_NAMES).toEqual('object');
        });
        it('ERROR_CODE should be defined and be an object', function () {
            expect(ERROR_CODE).toBeDefined();
            expect(typeof ERROR_CODE).toEqual('object');
        });
        it('Location should be defined and be an object', function () {
            expect(Location).toBeDefined();
            expect(typeof Location).toEqual('object');
        });
        it('$sce should be defined and be an object', function () {
            expect($sce).toBeDefined();
            expect(typeof $sce).toEqual('object');
        });
        it('$location should be defined and be an object', function () {
            expect($location).toBeDefined();
            expect(typeof $location).toEqual('object');
        });
        it('$routeParams should be defined and be an object', function () {
            expect($routeParams).toBeDefined();
            expect(typeof $routeParams).toEqual('object');
        });
    });

    describe('UNIT: Init', function () {
        describe('When success of Auction info get', function () {
            it('it should resolve and return data', function () {
                $rootScope.$digest();
                expect(WidgetAuction.data.content.sortBy).toEqual('Newest');
            })
        });
    });
    describe('WidgetAuction.cropImage', function () {

        it('should pass if it returns true when cropImage is not the default html', function () {
            WidgetAuction.cropImage('image.png', {height: 100, width: 100});
            WidgetAuction.cropImage();
        });
    });
    describe('WidgetAuction.safeHtml', function () {
        it('should pass if it returns true when WidgetAuction.safeHtml is not the default html', function () {
            WidgetAuction.safeHtml('<div>Div Content</div>');
        });
    });
    describe('WidgetAuction.openLinks', function () {
        it('should pass if it returns true when WidgetAuction.openLinks is not the default html', function () {
            WidgetAuction.openLinks([{}]);
        });
    });
});

describe('Unit : cars Plugin widget.cars.controller.js when buildfire content not defined', function () {
    var WidgetAuction, scope, $rootScope, $controller, Buildfire, TAG_NAMES, ERROR_CODE, Location, $sce, $location, $routeParams;
    beforeEach(module('auctionPluginWidget'));

    beforeEach(module('auctionPluginWidget', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'getById', 'onUpdate', 'onRefresh']);
            this.datastore.get.and.callFake(function (_tagName, callback) {
                if (_tagName) {
                    callback(null, {
                        data: {
                            design: {
                                itemLayout: '',
                                listLayout: ''
                            },
                            content: null
                        }
                    });
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.getById.and.callFake(function (_itemId, _tagName, callback) {
                if (_itemId && _tagName) {
                    callback(null, {
                        data: {
                            design: {
                                itemLayout: '',
                                listLayout: ''
                            },
                            content: {
                                sortBy: 'Newest'
                            }
                        }
                    });
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.onUpdate.and.callFake(function (callback) {
                callback('Event');
                return {
                    clear: function () {
                        return true
                    }
                }
            });
        });
    }));

    beforeEach(inject(function (_$rootScope_, _$controller_, _TAG_NAMES_, _ERROR_CODE_, _Location_, _Buildfire_, _$sce_, _$location_, _$routeParams_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Buildfire = _Buildfire_;
        Buildfire.deeplink = {};
        TAG_NAMES = _TAG_NAMES_;
        ERROR_CODE = _ERROR_CODE_;
        Location = jasmine.createSpyObj('Location', ['goTo']);
        Buildfire.deeplink = jasmine.createSpyObj('Buildfire.deeplink', ['getData']);
        $sce = _$sce_;
        $location = _$location_;
        $routeParams = _$routeParams_;
    }));

    beforeEach(function () {
        WidgetAuction = $controller('WidgetAuctionCtrl', {
            $scope: scope,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ERROR_CODE: ERROR_CODE,
            Location: Location,
            $sce: $sce,
            $rootScope: $rootScope,
            $location: $location,
            $routeParams: {id: 'id1'}
        });
    });

    describe('UNIT: getContentAuctionInfo', function () {
        describe('When success of Auction info get', function () {
            it('it should resolve and return data', function () {
                $rootScope.$digest();
                expect(WidgetAuction.data.content.sortBy).toEqual('Oldest to Newest');
            })
        });
    });
});

describe('Unit : cars Plugin widget.cars.controller.js when buildfire design not defined', function () {
    var WidgetAuction, scope, $rootScope, $controller, Buildfire, TAG_NAMES, ERROR_CODE, Location, $sce, $location, $routeParams;
    beforeEach(module('auctionPluginWidget'));

    beforeEach(module('auctionPluginWidget', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'getById', 'onUpdate', 'onRefresh']);
            this.datastore.get.and.callFake(function (_tagName, callback) {
                if (_tagName) {
                    callback(null, {
                        data: {
                            design: null,
                            content: {
                                sortBy: 'Newest'
                            }
                        }
                    });
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.getById.and.callFake(function (_itemId, _tagName, callback) {
                if (_itemId && _tagName) {
                    callback(null, {
                        data: {
                            design: {
                                itemLayout: '',
                                listLayout: ''
                            },
                            content: {
                                sortBy: 'Newest'
                            }
                        }
                    });
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.onUpdate.and.callFake(function (callback) {
                callback({tag: 'cars', data: {design: {backgroundImage: 'bg.png', itemLayout: 'layout1'}}});
                return {
                    clear: function () {
                        return true
                    }
                }
            });
        });
    }));

    beforeEach(inject(function (_$rootScope_, _$controller_, _TAG_NAMES_, _ERROR_CODE_, _Location_, _Buildfire_, _$sce_, _$location_, _$routeParams_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Buildfire = _Buildfire_;
        Buildfire.deeplink = {};
        TAG_NAMES = _TAG_NAMES_;
        ERROR_CODE = _ERROR_CODE_;
        Location = jasmine.createSpyObj('Location', ['goTo']);
        Buildfire.deeplink = jasmine.createSpyObj('Buildfire.deeplink', ['getData']);
        $sce = _$sce_;
        $location = _$location_;
        $routeParams = _$routeParams_;
    }));

    beforeEach(function () {
        WidgetAuction = $controller('WidgetAuctionCtrl', {
            $scope: scope,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ERROR_CODE: ERROR_CODE,
            Location: Location,
            $sce: $sce,
            $rootScope: $rootScope,
            $location: $location,
            $routeParams: $routeParams
        });
    });

    describe('UNIT: getContentAuctionInfo', function () {
        describe('When success of Auction info get', function () {
            it('it should resolve and return data', function () {
                $rootScope.$digest();
                expect(WidgetAuction.data.design.itemLayout).toEqual('item-layout-1');
                expect(WidgetAuction.data.design.listLayout).toEqual('list-layout-1');
            })
        });
    });
});