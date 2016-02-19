

app.controller('homeCtrl', function($scope, profileService, friendService) {


   $scope.findFriends = function(query) {
      friendService.findFriends($scope.myProfile._id, query)
      .then(function(serverResponse) {
            $scope.potentialFriends = serverResponse.data;
      });
   };

   $scope.addFriend = function(friendId) {
      friendService.addFriend($scope.myProfile._id, friendId)
      .then(function() {
         $scope.checkForPeople();
      }).catch(function(err){
         return console.error(err);
      });
   };

      $scope.removeFriend = function(friendId) {
         friendService.removeFriend($scope.myProfile._id, friendId)
         .then(function(){
            $scope.checkForPeople();
         });
      };





   $scope.checkForPeople = function() {
      var profileId = JSON.parse(localStorage.getItem('profileId'));

      if (profileId) {
         profileService.checkForPeople(profileId.profileId)
         .then(function(serverResponse) {
            $scope.myProfile = serverResponse.data;
            friendService.findFriendsFriends(serverResponse.data);
         })
         .catch(function(err){
            console.error(err);
         });
      }


   };
   $scope.checkForPeople();






   $scope.sortOptions = [
      {display: 'Ascending',
       value: false
      },
      {display: 'Descending',
       value: true
      }
   ];



   $scope.saveProfileButton = function(profile){
      profileService.saveProfileButton(profile);
      $scope.editing =  false;
   };


   $scope.deleteProfile = function() {
      profileService.deleteProfile()
      .then(function(deleteProfile) {
         localStorage.removeItem('profileId');
         $scope.myProfile = {};
      })
      .catch(function(err) {
         console.error(err);
      });
   };


});
