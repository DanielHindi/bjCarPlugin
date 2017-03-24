'use strict';

(function (angular) {
    angular
        .module('auctionPluginContent')
        .controller('RemoveAuctionPopupCtrl', ['$scope', '$modalInstance', 'auctionInfo', function ($scope, $modalInstance, auctionInfo) {
            var RemoveAuctionPopup = this;
            if(auctionInfo){
                RemoveAuctionPopup.auctionInfo = auctionInfo;
            }
            RemoveAuctionPopup.ok = function () {
                $modalInstance.close('yes');
            };
            RemoveAuctionPopup.cancel = function () {
                $modalInstance.dismiss('No');
            };
        }])
})(window.angular);
