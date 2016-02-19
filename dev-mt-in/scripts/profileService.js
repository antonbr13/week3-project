// services do no take in the $scope parameter - they have no direct link to the view - they are primarily used to pass data to the controllers

// Create a new service
// The reason we are using a new service rather than extending our current service is because it is generally a good idea to keep services as singularly focused as possible.


app.service('friendService', function($http, $q){

   var baseUrl = 'http://connections.devmounta.in';

   this.findFriendsFriends = function(profile) {
      var index = 0;
      var deferred = $q.defer();
      function getNextFriend() {
         if (profile.friends[index]) {
            return $http({
               method: "GET",
               url: baseUrl + '/api/friends-friends/' + profile.friends[index]._id
            })
            .then(function(friends) { //Taking in an array of friends returned from the server.
                 profile.friends[index].friends = friends.data; // Update our friend with the recieved data.
                 index++; // Increment our counter.
                 getNextFriend(); // Recall the function to handle the next friend.
            })
            .catch(function(err) { // Error Catching
                 return console.error(err);
            });

         } else { // Once we have finished running through our friends array
            deferred.resolve(profile); // Resolve our promise with our updated profile
            return deferred.promise; // Return the promise
            }

         }

         getNextFriend();

   };

   this.findFriends = function(userId, query) {
      return $http({
         method: 'GET',
         url: baseUrl + '/api/friends/' + userId + '?name=' + query
      });

   };

   this.addFriend = function(userId, friendId) {
      return $http({
         method: "PUT",
         url: baseUrl + '/api/friends/' + userId,
         data: {friendId: friendId}
      });
   };

   this.removeFriend = function(userId, friendId) {
      return $http({
         method: "PUT",
         url: baseUrl + '/api/friends/remove/' + userId,
         data: {friendId: friendId}
      });
   };

});



//---------------------------------



app.service('profileService', function($http){
   var baseUrl = 'http://connections.devmounta.in/';



// the function below posts profile to a database


   this.saveProfileButton = function(profile) {
      return $http({
         method: 'POST',
         url: baseUrl + 'api/profiles/',
         data: profile
      })
      .then(function(databaseResponse) {
         // console.log(databaseResponse);
         localStorage.setItem('profileId', JSON.stringify({ profileId: databaseResponse.data._id}));
      })
      .catch(function(err){
         console.error(err);
      });
   };


// this function gets data from the database

   this.checkForPeople = function(profileId) {
      return $http({
         method: "GET",
         url: baseUrl + 'api/profiles/' + profileId
      });


   };


//

   this.deleteProfile = function() {
         var profileId =      JSON.parse(localStorage.getItem('profileId')).profileId;

         return $http ({
            method: "DELETE",
            url: baseUrl + 'api/profiles/' + profileId
         });


   };


});
