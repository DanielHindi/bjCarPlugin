describe('Unit : auctionPluginContent content cars remove modal', function () {
    var RemoveAuctionPopup, scope, $rootScope, $controller,modalInstance;
    beforeEach(module('auctionPluginContent'));
    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        modalInstance = { // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));

    beforeEach(function () {
        RemoveAuctionPopup = $controller('RemoveAuctionPopupCtrl', {
            $scope: scope,
            $modalInstance:modalInstance,
            auctionInfo: {}
        });
    });

    describe('It will test the defined methods', function () {
        it('it should pass if RemoveAuctionPopup is defined', function () {
            expect(RemoveAuctionPopup).not.toBeUndefined();
        });
        it('RemoveAuctionPopupCtrl.cancel should close modalInstance', function () {
            RemoveAuctionPopup.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('No');
        });
        it('RemoveAuctionPopupCtrl.ok should close modalInstance', function () {
            RemoveAuctionPopup.ok();
            expect(modalInstance.close).toHaveBeenCalledWith('yes');
        });
    });
});