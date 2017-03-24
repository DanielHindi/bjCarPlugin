'use strict';
(function (angular, buildfire) {
  angular
    .module('auctionPluginContent')
    .controller('ContentAuctionCtrl', ['$scope', 'Location', '$modal', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE', '$routeParams', 'RankOfLastItem', '$rootScope',
      function ($scope, Location, $modal, Buildfire, TAG_NAMES, STATUS_CODE, $routeParams, RankOfLastItem, $rootScope) {
        var _rankOfLastItem = RankOfLastItem.getRank();
        var ContentAuction = this;
        ContentAuction.isUpdating = false;
        ContentAuction.isNewItemInserted = false;
        ContentAuction.unchangedData = true;
        ContentAuction.linksSortableOptions = {
          handle: '> .cursor-grab'
        };
        var _data = {
          topImage: '',
          fName: '',
          lName: '',
          position: '',
          deepLinkUrl: '',
          dateCreated: "",
          socialLinks: [],
          bodyContent: '',
          rank: _rankOfLastItem
        };

        //Scroll current view to top when page loaded.
        buildfire.navigation.scrollTop();

        ContentAuction.item = {
          data: angular.copy(_data)
        };

        ContentAuction.bodyContentWYSIWYGOptions = {
          plugins: 'advlist autolink link image lists charmap print preview',
          skin: 'lightgray',
          trusted: true,
          theme: 'modern',
          plugin_preview_width : "500",
          plugin_preview_height : "500"
        };
        /*
         Send message to widget that this page has been opened
         */
        if ($routeParams.itemId) {
          buildfire.messaging.sendMessageToWidget({
            id: $routeParams.itemId,
            type: 'OpenItem'
          });
        }

        updateMasterItem(ContentAuction.item);
        function updateMasterItem(item) {
          ContentAuction.masterItem = angular.copy(item);
        }

        function resetItem() {
          ContentAuction.item = angular.copy(ContentAuction.masterItem);
        }

        function isUnchanged(item) {
          return angular.equals(item, ContentAuction.masterItem);
        }

        function isValidItem(item) {
          return item.fName || item.lName;
        }

        /*On click button done it redirects to home*/
        ContentAuction.done = function () {
          console.log('Done called------------------------------------------------------------------------');
          Buildfire.history.pop();
          Location.goToHome();
        };

        ContentAuction.getItem = function (itemId) {
          Buildfire.datastore.getById(itemId, TAG_NAMES.AUCTION, function (err, item) {
            if (err)
              throw console.error('There was a problem saving your data', err);
            ContentAuction.item = item;
            _data.dateCreated = item.data.dateCreated;
            _data.rank = item.data.rank;
            if(item && item.data && !item.data.deepLinkUrl) {
                ContentAuction.item.data.deepLinkUrl = Buildfire.deeplink.createLink({id: item.id});
            }
            updateMasterItem(ContentAuction.item);
            $scope.$digest();
          });
        };

        if ($routeParams.itemId) {
          ContentAuction.getItem($routeParams.itemId);
        }

        ContentAuction.addNewItem = function () {
          ContentAuction.isNewItemInserted = true;
          _rankOfLastItem = _rankOfLastItem + 10;
          ContentAuction.item.data.dateCreated = +new Date();
          ContentAuction.item.data.rank = _rankOfLastItem;

          console.log("inserting....");
          Buildfire.datastore.insert(ContentAuction.item.data, TAG_NAMES.AUCTION, false, function (err, data) {
            console.log("Inserted", data.id);
            ContentAuction.isUpdating = false;
            if (err) {
              ContentAuction.isNewItemInserted = false;
              return console.error('There was a problem saving your data');
            }
            RankOfLastItem.setRank(_rankOfLastItem);
            ContentAuction.item.id = data.id;
            _data.dateCreated = ContentAuction.item.data.dateCreated;
            _data.rank = ContentAuction.item.data.rank;
            updateMasterItem(ContentAuction.item);
            ContentAuction.item.data.deepLinkUrl = Buildfire.deeplink.createLink({id: data.id});
            // Send message to widget as soon as a new item is created with its id as a parameter
            if (ContentAuction.item.id) {
              buildfire.messaging.sendMessageToWidget({
                id: ContentAuction.item.id,
                type: 'AddNewItem'
              });
            }
            $scope.$digest();
          });
        };

        ContentAuction.updateItemData = function () {
          Buildfire.datastore.update(ContentAuction.item.id, ContentAuction.item.data, TAG_NAMES.AUCTION, function (err) {
            ContentAuction.isUpdating = false;
            if (err)
              return console.error('There was a problem saving your data');
          })
        };

        ContentAuction.openEditLink = function (link, index) {
          var options = {showIcons: false};
          var callback = function (error, result) {
            if (error) {
              return console.error('Error:', error);
            }
            if (result === null) {
              return console.error('Error:Can not save data, Null record found.');
            }
            ContentAuction.item.data.socialLinks = ContentAuction.item.data.socialLinks || [];
            ContentAuction.item.data.socialLinks.splice(index, 1, result);
            $scope.$digest();
          };
          Buildfire.actionItems.showDialog(link, options, callback);
        };

        ContentAuction.onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
          if (event && event.status) {
            switch (event.status) {
              case STATUS_CODE.INSERTED:
                console.info('Data inserted Successfully');
                Buildfire.datastore.get(TAG_NAMES.AUCTION_INFO, function (err, result) {
                  if (err) {
                    return console.error('There was a problem saving your data', err);
                  }
                  result.data.content.rankOfLastItem = _rankOfLastItem;
                  Buildfire.datastore.save(result.data, TAG_NAMES.AUCTION_INFO, function (err) {
                    if (err)
                      return console.error('There was a problem saving last item rank', err);
                  });
                });
                break;
              case STATUS_CODE.UPDATED:
                console.info('Data updated Successfully');
                break;
            }
          }
        });

        var linkOptions = {"icon": "true"};
        ContentAuction.linksSortableOptions = {
          handle: '> .cursor-grab'
        };

        ContentAuction.openAddLinkPopup = function () {
          var options = {showIcons: false};
          var callback = function (error, result) {
            if (error) {
              return console.error('Error:', error);
            }
            if (!ContentAuction.item.data.socialLinks) {
              ContentAuction.item.data.socialLinks = [];
            }
            if (result === null) {
              return console.error('Error:Can not save data, Null record found.');
            }
            if(result.action == "sendSms"){
              result.body ="Hello. How are you? This is a test message."
            }
            ContentAuction.item.data.socialLinks.push(result);
            $scope.$digest();
          };
          Buildfire.actionItems.showDialog(null, linkOptions, callback);
        };

        ContentAuction.removeLink = function (_index) {
          ContentAuction.item.data.socialLinks.splice(_index, 1);
        };

        var options = {showIcons: false, multiSelection: false};
        var callback = function (error, result) {
          if (error) {
            return console.error('Error:', error);
          }
          if (result.selectedFiles && result.selectedFiles.length) {
            ContentAuction.item.data.topImage = result.selectedFiles[0];
            $scope.$digest();
          }
        };

        ContentAuction.selectTopImage = function () {
          Buildfire.imageLib.showDialog(options, callback);
        };

        ContentAuction.removeTopImage = function () {
          ContentAuction.item.data.topImage = null;
        };

        var tmrDelayForAuctions = null;
        var updateItemsWithDelay = function (item) {
          clearTimeout(tmrDelayForAuctions);
          ContentAuction.isUpdating = false;
          ContentAuction.unchangedData = angular.equals(_data, ContentAuction.item.data);

          ContentAuction.isItemValid = isValidItem(ContentAuction.item.data);
          if (!ContentAuction.isUpdating && !isUnchanged(ContentAuction.item) && ContentAuction.isItemValid) {
            tmrDelayForAuctions = setTimeout(function () {
              if (item.id) {
                ContentAuction.updateItemData();
              } else if (!ContentAuction.isNewItemInserted) {
                ContentAuction.addNewItem();
              }
            }, 300);
          }
        };

        $scope.$watch(function () {
          return ContentAuction.item;
        }, updateItemsWithDelay, true);

        $scope.$on("$destroy", function () {
          console.log("^^^^^^^^^^^^^^^^^^");
          ContentAuction.onUpdateFn.clear();
        });
      }]);
})(window.angular, window.buildfire);
