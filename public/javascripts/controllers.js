app.controller('IndexCtrl', ['$scope', '$resource', '$location', 'postSelectedService',
  function($scope, $resource, $location, postSelectedService){

  /* CAROUSEL */
  $scope.myInterval = 5000;
  $scope.noWrapSlides = true;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.addSlide = function(id, title, image, resume) {
    slides.push({
      title: title,
      image: image,
      text: resume,
      postId : id,
      id: currIndex++
    });
  };

  // Get carousel posts
  var CarouselPosts = $resource('/posts/carousel');
  CarouselPosts.query(function(carPosts){
      
      //Agrego cada post al carousel
      for(i = 0; i< carPosts.length; i++){
            $scope.addSlide(carPosts[i]._id, carPosts[i].title, carPosts[i].image,carPosts[i].resume);
      }
  });
  /* CAROUSEL END */
  /* TOP POSTS */
  var TopPosts = $resource('/posts/top');
  TopPosts.query(function(retTopPost){
      
    $scope.topPosts = retTopPost;
  });
  /* TOP POSTS END*/

  /* OTHER POSTS PAGINATED*/
  $scope.limit = 5;
  $scope.page = 1;
  $scope.morePostsAvailable = true;
  var Posts = $resource('/posts/all/:limit/:page');
  Posts.get({limit: $scope.limit, page: $scope.page }, function(retPost){
    $scope.posts = retPost.docs;
    // morePostsAvailable
    if (Number(retPost.pages) <= Number(retPost.page)){
      $scope.morePostsAvailable = false;
    }
  });

  $scope.loadMorePosts = function(){
    $scope.page++;
    Posts.get({limit: $scope.limit, page: $scope.page }, function(retPost){
      for(i = 0; i< retPost.docs.length; i++){
          $scope.posts.push(retPost.docs[i]);
      }
      // morePostsAvailable
      if (Number(retPost.pages) <= Number(retPost.page)){
        $scope.morePostsAvailable = false;
      }  
    });
  }
  /* OTHER POSTS PAGINATED END*/

  /* select one post and redirect to that post */
  $scope.viewPost = function(postId){
    postSelectedService.postId = postId;
    $location.path('/post');
  };

}]);

app.controller('PostCtrl', ['$scope', '$resource', '$routeParams', '$location', 'postSelectedService',
  function($scope, $resource, $routeParams, $location, postSelectedService){
    $scope.link = "";
    $scope.actual = '/#'+$location.path();

    $scope.exists = false;
    var id = $routeParams.id || postSelectedService.postId ;
    var Post = $resource('/posts/one/:id');
    Post.get({ id: id }, function(retPost){
      $scope.post = retPost;
      if(retPost._id != null && retPost._id != ""){
        $scope.exists = true;
        $scope.link = $location.absUrl();
        if($scope.link.endsWith("/post")){
          $scope.link = $scope.link+'/'+retPost._id;
        }
      }
    });
}]);

app.controller('PostsListCtrl', ['$scope', '$resource', '$routeParams',
  function($scope, $resource, $routeParams){
    $scope.limit = 10;
    $scope.page = 1;
    $scope.morePostsAvailable = true;
    var Posts = $resource('/posts/all/:limit/:page');
    Posts.get({limit: $scope.limit, page: $scope.page }, function(retPost){
    $scope.posts = retPost.docs;
    // morePostsAvailable
    if (Number(retPost.pages) <= Number(retPost.page)){
      $scope.morePostsAvailable = false;
    }
  });

  $scope.loadMorePosts = function(){
    $scope.page++;
    Posts.get({limit: $scope.limit, page: $scope.page }, function(retPost){
      for(i = 0; i< retPost.docs.length; i++){
          $scope.posts.push(retPost.docs[i]);
      }
      // morePostsAvailable
      if (Number(retPost.pages) <= Number(retPost.page)){
        $scope.morePostsAvailable = false;
      }  
    });
  }
}]);

app.controller('LoginCtrl', ['$scope', '$resource', '$location', 'userService', 'previousPageService',
  function($scope, $resource, $location, userService, previousPageService){
    $scope.login_error = false;
    $scope.username = "";
    $scope.password = "";
    var previousPage = previousPageService.page || '/blogadmin/posts';

    $scope.isAuthenticated = userService.isAuth;
    $scope.username = userService.username;

    $scope.submitForm = function(isValid){
      
      if (isValid){

        var Login = $resource('/api/authenticate');
        Login.save({ username: $scope.username, password: $scope.password }, function(login){
          if( login.success == true ){
              userService.login(login.username, login.token);
              $location.path(previousPage);  
          } else {
            $scope.login_error = true;
          }
        });
      } else{
        $scope.showErrors = true;
      }
    }
    
}]);

app.controller('HeaderCtrl', ['$scope', '$location', 'userService', 
  function($scope, $location, userService){
    $scope.username = "";
    $scope.isAuthenticated = userService.isAuthenticated();
    if ( $scope.isAuthenticated ){
      $scope.username = userService.username;
    }

    $scope.$watch(userService.isAuthenticated,function () {
        $scope.isAuthenticated = userService.isAuthenticated();
    })

    $scope.logout = function(){
      userService.logout();
      $scope.isAuthenticated = false;
      $location.path('/');
    }
    
}]);

app.controller('NewPostCtrl', ['$scope', '$resource', '$location', 'textAngularManager',
  function($scope, $resource, $location, textAngularManager){

    $scope.saveError = false;
    $scope.sessionExpired = false;
    $scope.showErrors = false;

    $scope.submitForm = function(isValid){

      if (isValid){
        var Posts = $resource('/api/posts/');
        Posts.save($scope.post, function(){
          $location.path('/');
        }, function(err){ //error handling
          if(403 == err.status ){
            // TODO: save post in a service and load it in this ctrl
            $scope.sessionExpired = true;
            $scope.showErrors = false;
            $scope.saveError = false;
          } else {
            $scope.showErrors = false;
            $scope.saveError = true;
          }
        });
      }
      else{
        $scope.showErrors = true;
      }
    };
}]);

app.controller('PostsForEditionCtrl', ['$scope', '$resource', '$location', 'postSelectedService',
  function($scope, $resource, $location, postSelectedService){

  $scope.limit = 10;
  $scope.page = 1;
  $scope.totalItems = 0;
  $scope.totalPages = 0;
  
  $scope.pageChanged = function(){
    var Posts = $resource('/api/posts/all4edit/:limit/:page');
    Posts.get({limit: $scope.limit, page: $scope.page }, function(retPost){
      $scope.posts = retPost.docs;
      $scope.totalItems = Number(retPost.total);
      $scope.totalPages = Number(retPost.pages);
    });
  }

  $scope.pageChanged();

  $scope.setPage = function (pageNo) {
    $scope.page = pageNo;
  };

  $scope.editPost = function(postId){
    postSelectedService.postId = postId;
    $location.path('/blogadmin/editpost');
  }

  $scope.postsPerPage = function(cantPosts){
    $scope.limit = cantPosts;
    $scope.pageChanged();
  }

}]);

app.controller('PostEditionCtrl', ['$scope', '$resource', '$routeParams', '$location', '$window', 'postSelectedService',
  function($scope, $resource, $routeParams, $location, $window, postSelectedService){

    var self = this;

    $scope.showSuccess = false;
    var id = postSelectedService.postId ;
    var Post = $resource('/api/posts/:id');
    Post.get({ id: id }, function(retPost){
      $scope.post = retPost;
    });

    $scope.submitForm = function(isValid){
      if (isValid){
        var Posts = $resource('/api/posts/:id', { id : id }, { update : {method : 'PUT'} });
        Posts.update($scope.post, function(retPost){
          $location.path('/blogadmin/editpost');
        }, function(err){ //error handling
          if(403 == err.status ){
            // TODO: save post in a service and load it in this ctrl
            $scope.sessionExpired = true;
            $scope.showErrors = false;
            $scope.saveError = false;
          } else {
            $scope.showErrors = false;
            $scope.saveError = true;
          }
        });
      }
      else{
        $scope.showSuccess = false;
        $scope.showErrors = true;
      }
    };

    $scope.deletePost = function (){
      deleteOK = $window.confirm('Are you sure you want to delete the post (can not be undone)?');
      if(deleteOK){
        Post.delete({ id: $scope.post._id }, function(retPost){
          $location.path('/blogadmin/posts');     
        });
      }
    }

}]);

app.controller('AddBloggerCtrl', ['$scope', '$resource', '$routeParams', '$location', '$window', 'postSelectedService',
  function($scope, $resource, $routeParams, $location, $window, postSelectedService){

    $scope.saveError = false;
    $scope.sessionExpired = false;
    $scope.showErrors = false;

    $scope.submitForm = function(isValid){
      if (isValid){
        var Blogger = $resource('/api/signup');
        Blogger.save({ username: $scope.username, password: $scope.password, email: $scope.email },
          function(blogger){
          $location.path('/blogadmin/bloggers');
        }, function(err){ //error handling
          if(403 == err.status ){
            // TODO: save post in a service and load it in this ctrl
            $scope.sessionExpired = true;
            $scope.showErrors = false;
            $scope.saveError = false;
          } else {
            $scope.showErrors = false;
            $scope.saveError = true;
          }
        });
      }
      else{
        $scope.showSuccess = false;
        $scope.showErrors = true;
      }
    };

}]);

app.controller('ChangePassCtrl', ['$scope', '$resource', '$routeParams', '$location', '$window', 'postSelectedService',
  function($scope, $resource, $routeParams, $location, $window, postSelectedService){

    $scope.saveError = false;
    $scope.sessionExpired = false;
    $scope.showErrors = false;
    $scope.notmatches = false;
    $scope.saveOK = false;

    $scope.submitForm = function(isValid){
      if (isValid){
        if($scope.newpassword === $scope.newpassword2) {
          var Blogger = $resource('/api/changepass');
          Blogger.save({ oldpassword: $scope.oldpassword, newpassword: $scope.newpassword },
            function(res){
              if (res.success == true) {
                $scope.sessionExpired = false;
                $scope.showErrors = false;
                $scope.saveError = false;
                $scope.notmatches = false;
                $scope.saveOK = true;
              } else {
                $scope.showErrors = false;
                $scope.saveError = true;
                $scope.notmatches = false;
              } 

          }, function(err){ //error handling
            if(403 == err.status ){
              // TODO: save post in a service and load it in this ctrl
              $scope.sessionExpired = true;
              $scope.showErrors = false;
              $scope.saveError = false;
              $scope.notmatches = false;
            } else {
              $scope.showErrors = false;
              $scope.saveError = true;
              $scope.notmatches = false;
            }
          });
        } else {
          $scope.notmatches = true;
        }
      }
      else{
        $scope.showSuccess = false;
        $scope.showErrors = true;
      }
    };

}]);
