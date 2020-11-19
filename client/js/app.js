var app = angular.module('dachshundApp', ['ngRoute', 'ngSanitize','ngFileUpload']);
 app.config(function($httpProvider,
                    $routeProvider,
                    $locationProvider,
                    $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.interceptors.push('TokenInterceptor');
    $locationProvider.hashPrefix('!');
    
    $routeProvider
    .when('/', {
        templateUrl: 'partials/loading.html',
        access: {
            requiredLogin: false 
        }
    })
    .when('/loading', {
        templateUrl: 'partials/loading.html',
        access: {
            requiredLogin: false 
        }
    })

    .when('/before/window', {
        templateUrl: 'partials/before_window.html',
        //로그인 유무 말고 다른 유무 ㄱㄱ
        access: {
            requiredLogin: false 
        }
    })

//BoardType별로 틀기
//이때 repeat은 intervalset이 필요한 창은 window창뿐이므로
//repeat='o'(영어 오 임) 일때만 repeat이 되도록 아니면 clearInterval로 작업해둠
    .when('/window/:repeat/house/:Name', {
        templateUrl: 'partials/Window_House.html',
        access: {
            requiredLogin: false 
        }
    })
    .when('/window/:repeat/school/:Name', {
        templateUrl: 'partials/Window_School.html',
        access: {
            requiredLogin: false 
        }
    })
    .when('/window/:repeat/cafe/:Name', {
        templateUrl: 'partials/Window_Cafe.html',
        access: {
            requiredLogin: false 
        }
    })
        
        .when('/main', {
            templateUrl: 'partials/main.html',
            access: {
                requiredLogin: false 
            }
        })
/*
        .when('/read/:seqno', {
            templateUrl: 'partials/read.html',
            access: {
                requiredLogin: true 
            }
        })
*/
        .when('/login', {
            templateUrl: 'partials/login.html',
            access: {
                requiredLogin: false
            }
        })
        .when('/Intro', {
            templateUrl: 'partials/Intro.html',
            access: {
                requiredLogin: false
            }
        })
        .when('/board', {
            templateUrl: 'partials/board.html',
            access: {
                requiredLogin: true
            }
        })

        .when('/content', {
            templateUrl: 'partials/content.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/rotation', {
            templateUrl: 'partials/rotation.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/addContent', {
            templateUrl: 'partials/addContent.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/modifyContent/:Num', {
            templateUrl: 'partials/modifyContent.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/managecontent', {
            templateUrl: 'partials/manageContent.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/content/:Name/all', {
            templateUrl: 'partials/content_all.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/content/:Name/image', {
            templateUrl: 'partials/content_image.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/content/:Name/text', {
            templateUrl: 'partials/content_text.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/content/:Name/video', {
            templateUrl: 'partials/content_video.html',
            access: {
                requiredLogin: true
            }
        })
        .when('/resetPassword', {
            templateUrl: 'partials/resetPassword.html',
            access: {
                requiredLogin: false
            }
        })
        .otherwise({
            redirectTo: '/main'
        });
});
 app.run(function($rootScope, $window, $location, AuthenticationFactory) {
     $rootScope.$on("$routeChangeStart", function(event, 
                                                 nextRoute, 
                                                 currentRoute) {
        if ((nextRoute.access && nextRoute.access.requiredLogin) && 
            !AuthenticationFactory.isAuthenticated()) {
            if ($location.path() !== '/login' || $location.path !== '/signup' ||
                $location.path() !== '/logout') {
                AuthenticationFactory.savePreviousUrl($location.path());
            }
             $location.path('/login');
        } 
        else {
            // check if user object exists else fetch it. 
            // This is incase of a page refresh
             AuthenticationFactory.resaveAuthentication();
        }
    });
     $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
        $rootScope.showMenu = AuthenticationFactory.isAuthenticated();
        // if the user is already logged in, take him to the home page
        if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
            $location.path('/');
        }
    });
});