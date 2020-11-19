app.controller("ContentController",
    ['$scope',
        '$rootScope',
        '$location',
        '$window',
        '$routeParams',
        'Upload',
        'UserAuthFactory',
        'AuthenticationFactory',
        'RequestFactory',
        function ($scope, $rootScope, $location, $window, $routeParams, Upload,
            UserAuthFactory, AuthenticationFactory, RequestFactory) {

            $scope.error =''
            $scope.isLogin = false
            $scope.items = [
                { a: 1 },

            ]

            //$scope.checkFlag = false;


            $scope.inputData = {
                No: '',
                B_sel: '',
                T_sel: '',
                start_date: '',
                end_date: '',
                Title: '',
                //
                Main: '',
            }
            /*
            
                    $scope.inputData = {
                        enddate: ''
                    }
            
                    $scope.changeDate = function() {
                        console.log($scope.inputData.enddate)
                    }
            */

           $scope.List_Type = [
            { T: 'Text' },
            { T: 'Image' },
            { T: 'Media' },

        ]
            $scope.updateBoard = function (item, isYN) {
                $scope.item.IsApproval = angular.copy(isYN)
                console.log($scope.upItem)
            }



            $scope.multiselect = {
                selected: [],
                options: [],
                config: {
                    hideOnBlur: false,
                    showSelected: false,
                    itemTemplate: function (item) {
                        // return $sce.trustAsHtml(item.name+' ('+item.email+')');
                    },
                    labelTemplate: function (item) {
                        // return $sce.trustAsHtml(item.name);
                    }
                }
            };



            if ($window.sessionStorage.user !== undefined) {
                $scope.isLogin = true
            }

            /*
            * 파일 업로드
            * $scope.files에 해당되는 파일을 업로드
            * 응답으로 업로드된 url을 받는다.
            */
            $scope.upload = function (files) {

                /*
                * $scope.files에 셋팅된 데이터를 서버로 전송합니다.
                */
                Upload.upload({
                    url: '/api/upload',
                    data: { files: files }
                }).then(function (resp) {
                    console.log('targetUrl : ' + resp.data);

                    /*
                    * 정상적으로 파일이 전송된 경우 서버에서 targetUrl 정보를 전송합니다.
                    * targetUrl 정보를 이용하여 사용자에게 이미지나 동영상을 미리 보여주면 됩니다.         * 
                    */
                    $scope.inputData.Main = resp.data;

                    console.log($scope.inputData.Main)

                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ');
                });
            };

            /* 지우지마
            달력 조건 세팅 우선은 주석처리1-1
                    $scope.fixedLength = function (arg) {
                        if (arg > 10) {
                             return '' + (arg)
                        }
                        else {
                            return '0' + (arg);
                        }
                    }
            
            
                    $scope.verifyDate = function(s_argdate, e_argdate) {
                        let s_date   = new Date(s_argdate),
                            e_date   = new Date(e_argdate),
                            now_date = new Date ();
                            
                        let s_dateString = s_date.getFullYear()     + $scope.fixedLength(s_date.getMonth() + 1) +  $scope.fixedLength(s_date.getDate());
                        let e_dateString = e_date.getFullYear()     + $scope.fixedLength(e_date.getMonth() + 1) +  $scope.fixedLength(e_date.getDate())
                        let now_dateString = now_date.getFullYear() + $scope.fixedLength(now_date.getMonth() + 1) + $scope.fixedLength(now_date.getDate())
            
                        if (s_dateString < now_dateString)  return false;
                        if (e_dateString < s_dateString)    return false;
            
                        return true;
                    }
            
            */





            //ActionUpload 
            $scope.ActionUpload = function () {
                console.log('ActionUpload start')
                console.log($scope.inputData.No)
                console.log($scope.inputData.B_sel)
                console.log($scope.inputData.T_sel)
                console.log($scope.inputData.start_date)
                console.log($scope.inputData.end_date)
                console.log($scope.inputData.Title)
                console.log($scope.inputData.Main)


                /*지우지마
                달력 조건 세팅 우선은 주석처리 1-2
                            if (! $scope.verifyDate ($scope.inputData.start_date, $scope.inputData.end_date) ){
                                $scope.error = 'invalid inpu date [start date > now, end_data > start date]';
                                return;
                            }
                
                
                */
                let data = {
                    no: $scope.inputData.No,
                    b_sel: $scope.inputData.B_sel,
                    t_sel: $scope.inputData.T_sel,
                    s_date: $scope.inputData.start_date,
                    e_date: $scope.inputData.end_date,
                    title: $scope.inputData.Title,
                    main: $scope.inputData.Main,

                }

                RequestFactory.post('/api/content/upload', data)
                    .then(function onSuccess(response) {
                        if (response.status === 200) {
                            console.log('request start')

                            $scope.error = ''
                            alert('업로드 완료');
                            $location.path('/managecontent')
                            
                        }
                        else {
                            console.log('request fail')
                            $scope.error = response.data.message;
                        }

                    }, function onError(response) {
                        console.log('request fail2')
                        $scope.error = response.data.message;
                    })

            }
            //ActionUpload 끝


            //요거 AddContent용
            //init 함수
            //서버 controller에서 new data 가져오기.
            $scope.init = function () {
                console.log("init")
                /* RequestFactory.get('/api/content/upload')
                     .then(function onSuccess(response) {
                         if (response.status === 200) {
                             //console.log(response.data)
                             $scope.items = response.data //배열식으로 item 변수에 할당됨.
                             //console.log($scope.items)
                         }
                         else {
                             $scope.error = response.data.message;
                         }
     
                     }, function onError(response) {
                         $scope.error = response.data.message;
                     })
     */
                RequestFactory.get('/api/get/boardlist') //get board
                    .then(function onSuccess(response) {
                        if (response.status === 200) {
                            console.log(response.data)
                            $scope.items = response.data //배열식으로 item 변수에 할당됨.
                            console.log($scope.items)
                            console.log($scope.inputData.B_sel)
                        }
                        else {
                            $scope.error = response.data.message;
                        }

                    }, function onError(response) {
                        $scope.error = response.data.message;
                    })

            }
            //init끝


            ////////////////////////////////ContentMange 전용////////////////////////////

            $scope.checkFlag = false;

            if ($window.sessionStorage.user !== undefined) {
                $scope.isLogin = true
            }


            $scope.changeCheckBox = function (No) {
                for (i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].No != No) continue;


                    if ($scope.items[i].checked) { //기존에 체크 되어 있으면 false로 바꾸기
                        $scope.items[i].checked = false;
                        console.log(No + '해제됨')

                    }
                    else {
                        $scope.items[i].checked = true; //체크 안되어있으면 false로 되어있으니 true로 바꾸기
                        console.log(No + '체크됨')
                    }

                    break;
                }
            }


                $scope.setAllChecked = function () {
                    $scope.checkFlag = !$scope.checkFlag;

                    for (i = 0; i < $scope.items.length; i++) {
                        $scope.items[i].checked = $scope.checkFlag;
                        console.log($scope.items[i].No + '체크됨')
                    }
                }


            $scope.BoardName = ''

            //init 함수
            //서버 controller에서 Main 가져오기.
            $scope.init_Main = function () {
                console.log('파람스로 url');
                $scope.BoardName = $routeParams.Name

                RequestFactory.get('/api/content/manage/' + $scope.BoardName)
                    .then(function onSuccess(response) {
                        if (response.status === 200) {
                            //console.log(response.data)                           
                            $scope.items = response.data //배열식으로 item 변수에 할당됨.
                            // $scope.setAllChecked(true);
                            console.log($scope.items)
                        }
                        else {
                            $scope.error = response.data.message;
                        }

                    }, function onError(response) {
                        $scope.error = response.data.message;
                    })
            }
            //init 끝


            //del 작업 시작
            $scope.actionDeleteContent = function () {
                for (i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].checked == true) { //체크된 얘들만 삭제할거임
                        console.log($scope.items[i].No + '삭제할 거임')

                        //일일이 삭제해야겠지? 리스트로 넘길까? 아냐, 하나씩 하자 우선은.. 
                        //그리고 컨텐츠 No만 넘기자
                        RequestFactory.delete('/api/content/manage/' + $scope.items[i].No)
                            .then(function onSuccess(response) {
                                if (response.status === 200) {
                                    //console.log(response.data)                           
                                    //$scope.items = response.data //배열식으로 item 변수에 할당됨.
                                    // $scope.setAllChecked(true);
                                    $scope.init_Main()  //리셋된 정보로 다시 화면 호출.
                                }
                                else {
                                    $scope.error = response.data.message;
                                }

                            }, function onError(response) {
                                $scope.error = response.data.message;
                            })
                    }
                    else continue;

                }
            }

            //modify용
            $scope.upItem = '';

            $scope.checkedNo = 0;
            //왜 let num으로 선언 안됨??


            //수정할때는 체크 하나만하게
            $scope.forcheck = function () {
                let count = 0
                let num =0

                for (i = 0; i < $scope.items.length; i++) {

                    //체크되었으면 count 안되었다면 저장하고, 그 뒤에 여러개 있는지 보기
                    if ($scope.items[i].checked == true) {
                        if (count == 0) {
                            $scope.checkedNo = $scope.items[i].No;
                            count = count + 1
                        }
                        else {
                            $scope.error='하나만 체크하여 수정 가능';
                            alert('하나만 체크하여 수정 가능');
                            count = count + 1
                            break;
                        }
                    }
                }
                //다돌고나서 체크한거 없으면 체크하라고 말하기
                if (count == 0) {
                    $scope.error='체크하시오';
                    alert('체크하시오');
                }
                else if(count==1) { //완벽히 작업 됬으면  
                    if ($scope.checkedNo != 0) {
                        $scope.error=$scope.checkedNo+'넘어왔음!!';
                        console.log($scope.checkedNo+'넘어왔음!!')
                        $scope.actionmodify()//$scope.checkedNo)
                    }
                }

            }

            $scope.store=[
                { a: 1 },

            ]
            
            $scope.actionmodify = function () {
                console.log('actionmodify 넘어옴')
                //먼저 checkedNo에 해당하는 Title이나 Main 가져와서 setting 하기
                $location.path('/modifyContent/'+ $scope.checkedNo)
               /*RequestFactory.get('/api/content/modify/' + $scope.checkedNo)
               .then(function onSuccess(response) {
                   if (response.status === 200) {                         
                       $scope.store = response.data //배열식으로 item 변수에 할당됨.
                       console.log($scope.store)
                       
                   }
                   else {
                       $scope.error = response.data.message;
                   }

               }, function onError(response) {
                   $scope.error = response.data.message;
               })*/
            }

            $scope.togoModify = function () {
                let data = {
                    no: $scope.inputData.No,
                    b_sel: $scope.inputData.B_sel,
                    t_sel: $scope.inputData.T_sel,
                    s_date: $scope.inputData.start_date,
                    e_date: $scope.inputData.end_date,
                    title: $scope.inputData.Title,
                    main: $scope.inputData.Main,

                }
            RequestFactory.put('/api/content/modify/' + $routeParams.Num,data)//+ <= 수정할 items No 넘기기$scope.items[i].No)
                .then(function onSuccess(response) {
                    if (response.status === 200) {
                        alert('수정완료');
                        $location.path('/managecontent')
                        
                        //console.log(response)

                    }
                    else {
                        $scope.error = response.data.message;
                    }

                }, function onError(response) {
                    $scope.error = response.data.message;
                })

            }

            //수정 전용init 함수
            //서버 controller에서 Main 가져오기.
            $scope.store=''

            $scope.init_Modify = function () {
                console.log('파람스로 url');
                var N = $routeParams.Num
                console.log('N은',N)
                RequestFactory.get('/api/content/modify/' + N)
                    .then(function onSuccess(response) {
                        if (response.status === 200) {
                            //console.log(response.data)                           
                            $scope.store = response.data[0] //배열식으로 item 변수에 할당됨.
                            $scope.inputData.B_sel=$scope.store.Name
                            $scope.inputData.T_sel=$scope.store.Type
                            $scope.inputData.start_date=$scope.store.Start_Date
                            $scope.inputData.end_date=$scope.store.End_Date
                            $scope.inputData.Title=$scope.store.Title
                            $scope.inputData.Main=$scope.store.Main
                            console.log($scope.store)
                        }
                        else {
                            $scope.error = response.data.message;
                        }

                    }, function onError(response) {
                        $scope.error = response.data.message;
                    })
            
           

                RequestFactory.get('/api/get/boardlist') //get board
                .then(function onSuccess(response) {
                    if (response.status === 200) {
                    // console.log(response.data)
                        $scope.items = response.data //배열식으로 item 변수에 할당됨.
                        console.log($scope.items)
                        //console.log($scope.inputData.B_sel)
                    }
                    else {
                        $scope.error = response.data.message;
                    }

                }, function onError(response) {
                    $scope.error = response.data.message;
                })
    
            }
            //init 끝

        }
    ]);
