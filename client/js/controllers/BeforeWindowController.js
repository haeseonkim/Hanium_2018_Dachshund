app.controller("BeforeWindowController",
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
        
        //날짜 설정
        var today =new Date();
        $scope.Today= {
            year:today.getFullYear(),
            month:today.getMonth()+1,
            day: today.getDate(),
            hour: today.getHours(),
            min:today.getMinutes(), 
            sec:today.getSeconds()
        }
        $scope.Date1 = $scope.Today.year+'.'+ $scope.Today.month+'.'+ $scope.Today.day+'';
        $scope.Time = $scope.Today.hour+'시'+ $scope.Today.month+'분'+ $scope.Today.day+'초';
        

        //->임의로 내가 설정함 -> 나중엔 라우터 파라미터로 받아오자
        $scope.BoardName = ''
        

/////////////////////////////////////////////////////////////before/window를 위한 
    $scope.init_BoardList = function () { 
        console.log("init_BoardList 들어옴")
        RequestFactory.get('/get/window/boardlist') //get board
        .then(function onSuccess(response) {
            if (response.status === 200) {
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

    //before_window에서 board radio 버튼 클릭 하면
    $scope.windowchoose= function (name) { 
        console.log('windowchoose 들어옴')
        $scope.BoardName = name
        console.log($scope.BoardName)
                
        if(confirm('게시판 '+$scope.BoardName+'(으)로 이동합니다.')==true){
            //Board Name 으로 BoardType 가져오기
            RequestFactory.get('/get/boardT/'+$scope.BoardName) //get board
            .then(function onSuccess(response) {
                if (response.status === 200) {
                    $scope.dataBT = response.data[0].BoardT //json 상태?로 무튼, {변수:데이터} 이런꼴
                    console.log('보드타입은'+$scope.dataBT)

                    console.log('if문 3개 바로 전')
                    ///////////////////////////☆☆☆☆☆☆여기 if문으로 3가지 나누기 ☆☆☆☆☆
                    if($scope.dataBT =='CAFE') {
                        console.log('CAFE 택함');
                        $location.path('/window/o/cafe/'+$scope.BoardName);}
                    else if ($scope.dataBT =='SCHOOL') {
                        console.log('SCHOOL 택함')
                        $location.path('/window/o/school/'+$scope.BoardName);
                    }
                    else if ($scope.dataBT =='HOUSE') {
                        console.log('HOUSE 택함')
                        $location.path('/window/o/house/'+$scope.BoardName);
                    }
                }
                else {
                    $scope.error = response.data.message;
                }

            }, function onError(response) {
                $scope.error = response.data.message;
            })

        }
        else{
            return;
        }
        
        
    }
//add Board>>>>>>>>
    //addBoard 버튼 클릭하면 추가됨.
        $scope.B_type='' //선택한 Board Type CAFE/HOUSE/SCHOOL

        //before_window에서 board radio 버튼 클릭 하면
        $scope.B_typechoose= function () { 
            console.log('B_typechoose 들어옴')            
            $scope.BoardName = prompt( '게시판 이름을 적으세요!', '' );
            console.log($scope.BoardName)
            console.log($scope.B_type)
            $scope.addBoard($scope.BoardName,$scope.B_type);
            
            
        }
        
    //$scope.addB=''
    $scope.addBoard=function(addB, BT){
       // var obj = prompt('BoardName을 추가하시오 \n※단 존재하는거 추가하지 마시오.') //default 있으면 안됨..
        let data = {
            NewBoard: addB,
            isApproval: 0,
            BoardType : BT
        }
        console.log(data)
        
        RequestFactory.post('/board/add',data)
        .then(function onSuccess(response) {
            if (response.status === 200) {
                console.log('request start')
                $scope.error = ''
                //var B_type = prompt( 'Lorem ipsum dolor', '3' );
                //console.log(B_type)
                alert('Board 추가 완료!\n 승인대기 바랍니다.\n(예상소요시간 1일)')
                //$location.reload('/before/window') //추가된 게시판과 함께 게시
                //res.redirect("/before/window")
                $scope.init_BoardList()
                $location.path('/main')
            }
            else {
                console.log('request fail')
                $scope.error = response.data.message;
            }

        }, function onError(response) {
            console.log('request fail2')
            console.log(response)
            $scope.error = response.data.message;
        })

    }


    }

]);
