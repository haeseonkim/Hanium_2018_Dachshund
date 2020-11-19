app.controller('LoginController', 
               ['$scope', 
                '$rootScope', 
                '$window', 
                '$location', 
                'UserAuthFactory', 
                'AuthenticationFactory',
                'RequestFactory',
    function($scope, 
             $rootScope, 
             $window, 
             $location, 
             UserAuthFactory, 
             AuthenticationFactory,
             RequestFactory) {

        $scope.error = '';

        $scope.user = {
            userId: 'admin',
            password: '1234' 
        };

        $scope.changepwuser = {
            userId: '',
            current_password: '',
            new_password: ''
        }


        $scope.init = function() {
            console.log('init')
        }

        $scope.clearError = function(){
            $scope.error = '';
        } 


//actionLogin        
        $scope.actionLogin = function() {

            
            let user = {
                userId: $scope.user.userId,
                password: $scope.user.password
            }


//먼저 로그인이 되야 비번변경이 됨.
            RequestFactory.post('/login', user)
                        .then(function onSuccess(response) {

                                if (response.status === 200) {
                                    AuthenticationFactory.saveAuthentication({userId: $scope.user.userId});
                                    $rootScope.$broadcast('userLoggedIn');
                                    
                                    //1234 초기비번으로 접속하면 변경하게 만들기.
                                    if((user.password=='1234')){
                                        $location.path('/resetPassword')
                                    }                                    
                                    else{
                                    //변경 비번으로 접속하면 메뉴 선택 화면으로 이동.
                                        $location.path('/admin');
                                    }
                                }
                                else {
                                    $scope.error = response.data.message;  
                                }
                                
                        }, function onError(response) {
                            $scope.error = response.data.message;


                        })

        }
//로그인 끝

//password 변경 창
        $scope.resetPassword = function() {
            $location.path('/resetPassword')
        }


        $scope.actionResetPassword = function() {

            let user = {
                userId: AuthenticationFactory.getAuthenticationInfo().userId,
                current_password: $scope.changepwuser.current_password,
                new_password: $scope.changepwuser.new_password
            }

            console.log(user)


            RequestFactory.put('/api/user', user)
                        .then(function onSuccess(response) {
                                if((user.new_password =='1234')){
                                    $scope.error = '비밀번호를 다시 설정하세요';
                                }
                                else if (response.status === 200) {
                                    console.log(response)
                                    
                                    //pw변경후 재로그인을 위한 login화면으로 이동
                                    
                                
                                        $location.path('/login'); 
                                        AuthenticationFactory.deleteAuthentication()
                                    
                                     
                                }
                                else {
                                    $scope.error = response.data.message;  
                                }
                            
                            
                                
                        }, function onError(response) {
                            $scope.error = response.data.message;
                        })
        }
        }
]);
