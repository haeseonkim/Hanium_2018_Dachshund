app.controller("BoardController",
               ['$scope', 
                '$rootScope',
                '$location', 
                '$window', 
                '$routeParams',
                'UserAuthFactory',
                'AuthenticationFactory',
                'RequestFactory',
    function($scope, $rootScope, $location, $window, $routeParams,
             UserAuthFactory, AuthenticationFactory,RequestFactory) {

        $scope.isLogin = false
        $scope.items = [ ]

        if($window.sessionStorage.user !== undefined ){
            $scope.isLogin = true
        }
        //error 출력 >login.html 에서만 39-43줄 
        //$scope.error = response.data.message;
        $scope.error = '';

        //위치 변수 정의
        $scope.location = '';
        
        //del pk 정의
        $scope.delName = '';

        //update pk 정의
        $scope.upItem = '';   
        


        //<삭제 이분화>
        //삭제 클릭 시
        $scope.deleteBoard = function (name) {
            $scope.delName = name  
        }
        //삭제 > 확인 까지  클릭 시
        $scope.actionDeleteBoard = function () {

            RequestFactory.delete('/api/board/'+$scope.delName)//따로 받을게 그릇이 없어서 > url로 data를 넘기겠다.
                .then(function onSuccess(response) {
                        if (response.status === 200) {
                            console.log(response)
                            $scope.init() //리셋된 정보로 다시 화면 호출.
                        }
                        else {
                            $scope.error = response.data.message;  
                        }
                        
                }, function onError(response) {
                    $scope.error = response.data.message;
            })

        
        }


        $scope.updateBoard = function (item, isYN) {
            $scope.upItem = item  
            $scope.location = $scope.upItem.Location
            $scope.upItem.IsApproval = angular.copy(isYN)

            console.log($scope.location)
            console.log($scope.upItem)
        }

        //승인,수정 확인 누르면
        $scope.actionUpdateBoard = function () {
 
            let data = {
                Name : $scope.upItem.Name,
                Location : $scope.location, //js BoardController의 input ng-model에서 받아옴.
                IsApproval: $scope.upItem.IsApproval
            }

            RequestFactory.put('/api/board',data)
                .then(function onSuccess(response) {
                        if (response.status === 200) {
                            console.log(response)
                            $scope.init() //리로딩..
                            $scope.location = ''
                        }
                        else {
                            $scope.error = response.data.message;  
                        }
                        
                }, function onError(response) {
                    $scope.error = response.data.message;
            })

        }


        //전체 승인
        $scope.actionAllApprove = function () {
            let data = {  
                IsApprove : 1
            }
            console.log("action")
            RequestFactory.put('/api/board',data)
                .then(function onSuccess(response) {
                        if (response.status === 200) {
                            console.log(response)
                            $scope.init() //리로딩..
                            //$scope.location = ''
                        }
                        else {
                            $scope.error = response.data.message;  
                        }
                        
                }, function onError(response) {
                    $scope.error = response.data.message;
            })

        }

    


        //init 함수
        //서버 controller에서 data 가져오기.
        $scope.init = function () {
            console.log("init")
            RequestFactory.get('/api/board')
                .then(function onSuccess(response) {
                        if (response.status === 200) {
                            console.log(response.data)
                            $scope.items = response.data //배열식으로 item 변수에 할당됨.
                            console.log($scope.items)
                            
                        }
                        else {
                            $scope.error = response.data.message;  
                        }
                        
                }, function onError(response) {
                    $scope.error = response.data.message;
            })
        }

        //컨텐츠 관리 버튼 이동 솔루션
        $scope.togo = function(name, sel){
            if(sel=='text')
                $location.path('/content/'+name+'/text')
            else if(sel=='image')
                $location.path('/content/'+name+'/image')
            else if(sel=='video')
                $location.path('/content/'+name+'/video')
            else
                $location.path('/content/'+name+'/all')

        }

        $scope.list_Image_src=["/images/1a.jpg", "/images/2a.jpg","/images/3a.jpg","/images/4a.jpg","/images/5a.jpg","/images/6a.jpg"];
       $scope.random_rgb=[];
        for(i=0;i<$scope.items.length;i++){
        var x=Math.round(Math.random() * 255);
        var y=Math.round(Math.random() * 255);
        var z=Math.round(Math.random() * 255);
        $scope.random_rgb[(item.Name)]={x,y,z}
        
       }
       
       console.log($scope.random_rgb)

    }
]);

