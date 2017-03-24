describe('Unit: auctionServices: Services', function () {
    beforeEach(module('auctionPluginContent'));
    beforeEach(module('auctionEnums'));


    describe('Unit : Buildfire service', function () {
        var Buildfire;
        beforeEach(inject(
            function (_buildfire_) {
                Buildfire = _buildfire_;
            }));
    });

    describe('Unit : DataStore Factory', function () {
        var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
        beforeEach(module('auctionPluginContent'));
        Buildfire = {
            datastore: {}
        };
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'getById', 'bulkInsert', 'insert', 'search', 'update', 'save', 'delete']);
        beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
            DataStore = _DataStore_;
            STATUS_CODE = _STATUS_CODE_;
            STATUS_MESSAGES = _STATUS_MESSAGES_;
        }));
    });
    describe('Unit : Auction service', function () {
        var DB, Auction, Buildfire, $rootScope;
        beforeEach(inject(
            function (_DB_, _$rootScope_) {
                DB = _DB_;
                Auction = new DB('Auction');
                $rootScope = _$rootScope_;
            }));
        beforeEach(inject(function () {
            Buildfire = {
                datastore: {}
            };
            Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'getById', 'bulkInsert', 'insert', 'search', 'update', 'save', 'delete']);
        }));

        it('Auction should exists', function () {
            expect(Auction).toBeDefined();
            expect(Auction._tagName).toEqual('Auction');
        });
        it('Auction methods should exists', function () {
            expect(Auction.get).toBeDefined();
            expect(Auction.find).toBeDefined();
            expect(Auction.save).toBeDefined();
            expect(Auction.update).toBeDefined();
            expect(Auction.delete).toBeDefined();
            expect(Auction.insert).toBeDefined();
        });
        describe('Get method:', function () {
            it('Auction.get methods should call Buildfire.datastore.get', function () {
                Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                Auction.get();
            });
            it('Auction.get methods should call Buildfire.datastore.get Error Case', function () {
                Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                    cb({code: 'No result found'}, null);
                });
                Auction.get();
            });

        });
        describe('getById method:', function () {
            it('Auction.getById methods should call Buildfire.datastore.getById', function () {
                Buildfire.datastore.getById.and.callFake(function (id, tagName, cb) {
                    cb(null, {data: {}});
                });
                Auction.getById('id1');
            });
            it('Auction.getById methods should call Buildfire.datastore.getById Error Case', function () {
                Buildfire.datastore.getById.and.callFake(function (id, tagName, cb) {
                    cb({}, null);
                });
                Auction.getById('id1');
                Auction.getById();
            });
        });
        describe('insert method:', function () {
            it('Auction.insert methods should call Buildfire.datastore.insert', function () {
                Buildfire.datastore.insert.and.callFake(function (item, tagName, cb) {
                    cb(null, {data: {}});
                });
                Buildfire.datastore.bulkInsert.and.callFake(function (items, tagName, cb) {
                    cb(null, [{}]);
                });
                Auction.insert([]);
                Auction.insert('asads');
                Auction.insert();
                $rootScope.$apply();
            });
            it('Auction.insert methods should call Buildfire.datastore.insert Error Case', function () {
                Buildfire.datastore.insert.and.callFake(function (item, tagName, cb) {
                    cb({}, null);
                });
                Buildfire.datastore.bulkInsert.and.callFake(function (item, tagName, cb) {
                    cb({}, null);
                });
                Auction.insert([]);
                Auction.insert('asads');
                Auction.insert();
            });
        });
        describe('find method:', function () {
            it('Auction.find methods should call Buildfire.datastore.search', function () {
                Buildfire.datastore.search.and.callFake(function (options, tagName, cb) {
                    cb(null, {});
                });
                Auction.find();
                Auction.find({});
            });
            it('Auction.find methods should call Buildfire.datastore.search Error Case', function () {
                Buildfire.datastore.search.and.callFake(function (options, tagName, cb) {
                    cb({}, null);
                });
                Auction.find();
                Auction.find({});
            });
        });
        describe('update method:', function () {
            it('Auction.update methods should call Buildfire.datastore.update', function () {
                Buildfire.datastore.update.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                Auction.update('id', {});
                Auction.update();
                Auction.update('id');
            });
            it('Auction.update methods should call Buildfire.datastore.update Error Case', function () {
                Buildfire.datastore.update.and.callFake(function (id, data, tagName, cb) {
                    cb({}, null);
                });
                Auction.update('id', {});
                Auction.update();
                Auction.update('id');
            });
        });
        describe('save method:', function () {
            it('Auction.save methods should call Buildfire.datastore.save', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                Auction.save({});
                Auction.save();
            });
            it('Auction.save methods should call Buildfire.datastore.save Error case', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb({}, null);
                });
                Auction.save({});
                Auction.save();
            });
        });
        describe('delete method:', function () {
            it('Auction.delete methods should call Buildfire.datastore.delete', function () {
                Buildfire.datastore.delete.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                Auction.delete();
                Auction.delete('id');
            });
            it('Auction.delete methods should call Buildfire.datastore.delete Error Case', function () {
                Buildfire.datastore.delete.and.callFake(function (tagName, cb) {
                    cb({}, null);
                });
                Auction.delete();
                Auction.delete('id');
            });
        });
    });

});