app.controller("WindowController",
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
        $scope.Date1 = $scope.Today.year+'.'+ $scope.Today.month+'.'+ $scope.Today.day+'.';
        $scope.Time = $scope.Today.hour+'시'+ $scope.Today.month+'분'+ $scope.Today.day+'초';
        

        //->임의로 내가 설정함 -> 나중엔 라우터 파라미터로 받아오자
        $scope.BoardName = ''
        

        //서버에서 데이터를 n초마다 가져옴....
        //아직 동영상 하나가 끝나기 전에 엎어버리는 지가 궁금함.
        //혹은 웹소킷 방식 이용하여 가능
        //html을 손대지 않아도 됨.


        var repeat = setInterval(function(){
            //before에는 없기
            //Window에는 있기
            //만약 Window.js를 이동해버리면, back button, 없어지면
            //-> 타이머 cancle 하기!

            //근데 힘들거 같으면, 아예 탭을 새로 열어버리기, (bank option)

            //이 안에서 행동을 취한다.
            console.log("Hello"); 
            $scope.init_Content();

            if($routeParams.repeat!='o'){
                console.log('종료')
                clearInterval(repeat);
            }

        },5000);
        //

        //init 함수
        //서버 controller에서 BoardName에 해당하는 Content 가져오기.
    
        $scope.init_Content = function () {
            $scope.BoardName = $routeParams.Name
            console.log($scope.BoardName)

            $scope.dataBT=''
            //1. Board Name 으로 BoardType 가져오기
            RequestFactory.get('/get/boardT/'+$scope.BoardName) //get board
            .then(function onSuccess(response) {
                if (response.status === 200) {
                    $scope.dataBT = response.data[0].BoardT //json 상태?로 무튼, {변수:데이터} 이런꼴
                    console.log('보드타입은'+$scope.dataBT)
                    return;
                }
                else {
                    $scope.error = response.data.message;
                }

            }, function onError(response) {
                $scope.error = response.data.message;
            })


            //2. Board Name으로 Content List 가져옴.
            RequestFactory.get('/content/manage/' + $scope.BoardName)
                .then(function onSuccess(response) {
                    if (response.status === 200) {                        
                        $scope.items = response.data //배열식으로 item 변수에 할당됨.
                        console.log($scope.items)
                        PutImage(); //List_Image_src를 만드는 함수 호출함.
                        $scope.init_Rotation()
                        console.log('rotation 컴컴')

                    }
                    else {
                        $scope.error = response.data.message;
                    }

                }, function onError(response) {
                    $scope.error = response.data.message;
                })

                
        }
        //init끝

        
        function PutImage() {
            //사용할 index 초기화 후
            var iindex=0;
            var i_evenindex=0;
            var i_oddindex=0;
            var i_count=0;
    
            var t_evenindex=0;
            var t_oddindex=0;
            var t_count=0;
    
            var mindex=0;

            //사용할 List 초기화 후
            $scope.List_Image1_src=[];
            $scope.List_Image2_src=[];
            $scope.List_Text1_src=[];
            $scope.List_Text2_src=[];
            $scope.List_Media_src=[];
            
            console.log('PutImage 들어옴');
            console.log($scope.items)

            console.log('BoardType출력');
            console.log($scope.dataBT)


            if($scope.dataBT =='CAFE') {
                console.log('CAFE 택함');
                //반복 시작
                for (i=0;i<$scope.items.length;i++){
                    let pickitem=$scope.items[i];
                    console.log('pcikitem');
                    console.log(pickitem);
                    
                    if(pickitem.Type=="Media"){
                        console.log('미디어 리스트에 넣는 중....')
                        // console.log(pickitem.Main)
                         $scope.List_Media_src[mindex]=pickitem.Main;
                         mindex++;
                     }
                     else if(pickitem.Type=="Image"){
                        if(i_count==0){
                            console.log('짝수 이미지 리스트에 넣는 중....')
                            // console.log(pickitem.Main)
                             $scope.List_Image1_src[i_evenindex]=pickitem.Main;
                             i_evenindex++;
                             i_count=1;
                             }
                         else{
                            console.log('홀수 이미지 리스트에 넣는 중....')
                             //console.log(pickitem.Main)
                             $scope.List_Image2_src[i_oddindex]=pickitem.Main;
                             i_oddindex++;
                             i_count=0;
                             }
                     }
                     else{ //나머지 text의 경우는 pass
                         continue;
                     }
                }
                //반복 끝
            }
            else if ($scope.dataBT =='SCHOOL') {
                console.log('SCHOOL 택함')
                for (i=0;i<$scope.items.length;i++){
                    let pickitem=$scope.items[i];
                    if(pickitem.Type=="Image"){
                        console.log('이미지 리스트에 넣는 중....')
                        $scope.List_Image1_src[iindex]=pickitem.Main;
                        iindex++;
                    }
                    else if(pickitem.Type=="Media"){
                         console.log('미디어 리스트에 넣는 중....')
                        // console.log(pickitem.Main)
                         $scope.List_Media_src[mindex]=pickitem.Main;
                         mindex++;
                     }
                     else if(pickitem.Type=="Text"){
                        if(t_count==0){
                             console.log('짝수 텍스트 리스트에 넣는 중....')
                            // console.log(pickitem.Main)
                             $scope.List_Text1_src[t_evenindex]=pickitem;
                             t_evenindex++;
                             t_count=1;
                             }
                         else{
                             console.log('홀수 텍스트 리스트에 넣는 중....')
                             //console.log(pickitem.Main)
                             $scope.List_Text2_src[t_oddindex]=pickitem;
                             t_oddindex++;
                             t_count=0;
                             }
                     }
                     else{
                        continue;
                    }
                }
            }
            else if ($scope.dataBT =='HOUSE') {
                console.log('HOUSE 택함')
                for (i=0;i<$scope.items.length;i++){
                    let pickitem=$scope.items[i];
                    if(pickitem.Type=="Image"){
                        $scope.List_Image1_src[iindex]=pickitem.Main;
                        iindex++;
                    }
                    else{
                        continue;
                    }
                }
            }
            console.log('이미지')
            console.log($scope.List_Image1_src);
            console.log($scope.List_Image2_src)
            console.log('텍스트')
            console.log($scope.List_Text1_src)
            console.log($scope.List_Text2_src)
            console.log('동영상')
            console.log($scope.List_Media_src)
        }
        //PutImage 끝



        
        $scope.init_Rotation = function () { //get board
            
            RequestFactory.get('/get/rotation/') 
            .then(function onSuccess(response) {
                if (response.status === 200) {
                   // console.log(response.data)
                    $scope.rotations = response.data[0] //배열식으로 item 변수에 할당됨.

                    //뒤에서 slide 부분에 적용하자.
                    $scope.rt=$scope.rotations.Ro_Text;
                    $scope.ri=$scope.rotations.Ro_Image;
                    $scope.rm=$scope.rotations.Ro_Media;
                    console.log("initt_BoardList ")
                    console.log($scope.rotations)
                    console.log( $scope.rt)
                }
                else {
                    $scope.error = response.data.message;
                }
    
            }, function onError(response) {
                $scope.error = response.data.message;
            })
    
        }
        //init 끝

 



/*
///////////slide를 위한 코드
        $("#slideshow > div:gt(0)").hide();

        setInterval(function() {
            //아직 시간 조절은 못함......
            //일단은 *$scope.List_Image_src.length 요건 추가해야함!
          $('#slideshow > div:first')
            .fadeOut()//1
            .next()
            .fadeIn()//6
            .end()
            .appendTo('#slideshow');
        }, 3000);//$scope.ri*1000);//-> 서버에서 받은 시간 넣음

        $("#slideshow2 > div:gt(0)").hide();

        setInterval(function() {
            //아직 시간 조절은 못함......
            //일단은 *$scope.List_Image_src.length 요건 추가해야함!
          $('#slideshow2 > div:first')
            .fadeOut()
            .next()
            .fadeIn()
            .end()
            .appendTo('#slideshow2');
        },3000);
       // }, ($scope.ri*1000));


////////////////
        $("#text_slideshow > div:gt(0)").hide();

        setInterval(function() {
            //아직 시간 조절은 못함......
            //일단은 *$scope.List_Image_src.length 요건 추가해야함!
          $('#text_slideshow > div:first')
            .fadeOut()
            .next()
            .fadeIn()
            .end()
            .appendTo('#text_slideshow');
        },3000);
       // }, $scope.rt*1000);

////////////////
        $("#media_slideshow > div:gt(0)").hide();

        setInterval(function() {
            //아직 시간 조절은 못함......
            //일단은 *$scope.List_Image_src.length 요건 추가해야함!
        $('#media_slideshow  > div:first')
            .fadeOut()
            .next()
            .fadeIn()
            .end()
            .appendTo('#media_slideshow');
        },30000); 
     //   }, $scope.rm*1000);
*/

    }

]);
