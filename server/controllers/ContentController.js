var path      = require('path');
var fs        = require('fs');
var multipart = require('connect-multiparty');
var uuid      = require('tiny-uuid4');
var mv        = require('mv');
var multipartMiddleware = multipart();


module.exports = function (app, db) {

    //pk에 해당하는 data 유무 확인
    function getContent(num, callback) {
        let sql = `SELECT Start_Date, End_Date, Title, Type, No, Main, Name
                    FROM Content
                    Where No = ?`
                     //UNION SELECT Name FROM Board

        db.all(sql, [num], callback) //[]대괄호 안에 값을 위에 ? 값에 대입. 

    }

    function getBoard1(callback) {
        let sql = `SELECT Name, IsApproval
                    FROM Board `

        db.all(sql, [], callback) //[]대괄호 안에 값을 위에 ? 값에 대입. 

    }

    function getAllContent( callback) {
        let sql = `SELECT Name, Type, Start_Date, End_Date, Title, Main
                    FROM Content
                    Where No=?`

        db.all(sql, [], callback) //[]대괄호 안에 값을 위에 ? 값에 대입. 

    }


    //파일 업로드
    app.post('/api/upload', multipartMiddleware, function(req, res) {
          
        /*
         * req.files에 업로드 파일이 전송됩니다. 
         * 그러므로, req.files이 null이 아니면
         * 해당 파일을 특정 디렉토리에 저장하면 됩니다.
         */
        if (req.files) {    
            /*
             * rootPath: 전송된 파일을 저장할 위치 (client/Upload 디렉토리 지정)
             * file: 브라우저에서 전송되는 파일 정보를 저장
             * originalPath: 임시적으로 저장된 파일 위치
             * uniqueFilename: 브라우저에서 전송되는 파일 이름을 그대로 사용하지 않고 유일한 값을 생성하여 저장
             * extension: 파일 확장자
             * targetPath: 실제 저장할 파일 위치 이름 확장자
             * targetUrl: 저장이 정상적으로 수행된 경우, 해당 파일을 접근하기 위한 URL을 응답시 전송 (데이터베이스에는 이 이름이 들어가야 합니다.)
             */

            
            try {
                let rootPath       = __dirname + '/../../client/Upload/';
                let file           = req.files.files;
                let originalPath   = file.path;
                let uniqueFilename = uuid().toString();
                let extension      = path.extname(originalPath);
                let targetPath     = rootPath + uniqueFilename + extension;
                let targetUrl      = "/Upload/" +  uniqueFilename + extension;



                    /*
                    * 임시 디렉토리에서 실제 저장할 디렉토리 이동 
                    */
                    mv(originalPath, targetPath, function(err) {
                        if (err)  {
                            if (err.code === 'ENOENT') {
                                console.log('No such directory or file. Check env target [' + rootPath + ']');
                            }
                            JsonResponse.sendJsonResponse(res, 500);
                            return;
                        }

                            JsonResponse.sendJsonResponse(res, 200, targetUrl);

                    });
            }
            catch(e) {
               JsonResponse.sendJsonResponse(res, 500);
            }            
    
        }

      });
      //파일 업로드  끝





    //Post
    app.post('/api/content/upload', function (req, res) {

        console.log('aaa')
        
        let Upload = req.body
        /* 넘어온 객체 데이터
            let data = {
                no : $scope.inputData.No,
                //b_sel : $scope.inputData.B_Sel,
                t_sel : $scope.inputData.T_Sel,
                s_date: $scope.inputData.start_date,
                e_date: $scope.inputData.end_date,
                title :$scope.inputData.Title,
                main :$scope.inputData.Main,
            }
        */
        console.log('put start')
        console.log(Upload)
        try {

            let sql = `INSERT INTO Content(Type,Start_Date,End_Date,Title,Main,Name) 
                        values ( ?,?,?,?,?,?)  `


            if (Upload === undefined ||  //Upload.no === undefined ||
                Upload.b_sel === undefined || Upload.b_sel.length <= 0 ||
                Upload.t_sel === undefined || Upload.t_sel.length <= 0 ||
                Upload.s_date === undefined || Upload.s_date.length <= 0 ||
                Upload.e_date === undefined || Upload.e_date.length <= 0 ||
                Upload.title === undefined || Upload.title.length <= 0 ||
                Upload.main === undefined || Upload.main.length <= 0) {

                //console.log(Upload) 
                //console.log(Upload.no)
                //console.log(Upload.t_sel)
                
                JsonResponse.sendJsonResponse(res, 400)
                return
            }
                    db.run(sql, [Upload.t_sel,
                                Upload.s_date,
                                Upload.e_date,
                                Upload.title,
                                Upload.main,
                                Upload.b_sel], (err) => { //정의한 sql 순서대로

                                    if (err) {
                                        console.error(err.message)
                                        JsonResponse.sendJsonResponse(res, 404)

                                        return
                                    }
                                    JsonResponse.sendJsonResponse(res, 200)

                                })
                }
                
        catch (e) {
            console.log(e)
            JsonResponse.sendJsonResponse(res, 500)
        }
    })
    //post끝


/*
    //get
    app.get('/api/content/upload', function (req, res) {
        //post와 put을 제외한 작업엔 무필요 let location = req.body
        //body에 data가 없으니.

        try {
            //변수 없. 아무것도 안 넘김.
            getAllContent((err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)
                }

                //조회해온 모든 결과를 
                if (row) {
                    console.log(row)
                    JsonResponse.sendJsonResponse(res, 200, row)

                }
                else {
                    JsonResponse.sendJsonResponse(res, 404)
                }
            })
        }
        catch (e) {
            JsonResponse.sendJsonResponse(res, 500)
        }
    })
    //get 끝
    */

    app.get('/api/get/boardlist', function (req, res) {
        try {
            //변수 없. 아무것도 안 넘김.
            getBoard1((err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)
                }

                //조회해온 모든 결과를 
                if (row) {
                    console.log(row)
                    JsonResponse.sendJsonResponse(res, 200, row)

                }
                else {
                    JsonResponse.sendJsonResponse(res, 404)
                }
            })
        }
        catch (e) {
            JsonResponse.sendJsonResponse(res, 500)
        }
    })



    ///////////////////////////////////ContentManage 전용//////////////////////////////////

            //content manage 할때 필요한 정보 가져오기
            function getMains(name, callback) {
                let sql = `SELECT No, Main, Title, Name, Type
                            FROM Content
                            WHERE Name = ? `
        
                db.all(sql, [name], callback) //[]대괄호 안에 값을 위에 ? 값에 대입. 
        
            }

            function getAllContent(num, callback) {
                let sql = `SELECT Name,Type,Start_Date,End_Date,Title,Main
                            FROM Content
                            WHERE No = ? `
        
                db.all(sql, [num], callback) //[]대괄호 안에 값을 위에 ? 값에 대입. 
        
            }
        
            app.get('/api/content/manage/:Name', function(req, res) {
                //post와 put을 제외한 작업엔 무필요 let location = req.body
                //body에 data가 없으니.
                let Name=req.params.Name //간략화
        
                try {
                    //변수 없. 아무것도 안 넘김.
                    getMains(Name,(err, row) => {
        
                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)        
                        }
                        
                        //조회해온 모든 결과를 
                        if (row) {
                            console.log(row)    
                            JsonResponse.sendJsonResponse(res, 200, row)                
                                
                        }
                        else {
                            JsonResponse.sendJsonResponse(res, 404) 
                        }
                    })
                } 
                catch (e) {
                    JsonResponse.sendJsonResponse(res, 500)  
                }  
            })
            //get 끝
            //// edit get시작
            app.get('/api/content/modify/:No', function(req, res) {
                //post와 put을 제외한 작업엔 무필요 let location = req.body
                //body에 data가 없으니.
                let No=req.params.No //간략화
        
                try {
                    //변수 없. 아무것도 안 넘김.
                    getAllContent(No,(err, row) => {
        
                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)        
                        }
                        
                        //조회해온 모든 결과를 
                        if (row) {
                            console.log(row)    
                            JsonResponse.sendJsonResponse(res, 200, row)                
                                
                        }
                        else {
                            JsonResponse.sendJsonResponse(res, 404) 
                        }
                    })
                } 
                catch (e) {
                    JsonResponse.sendJsonResponse(res, 500)  
                }  
            })
            //get 끝


            //del 시작
            app.delete('/api/content/manage/:No', function (req, res) {
                //api/board/뒤에 있는 나머지 url값을 req.params.Name변수에 할당하겠다.
                let No = req.params.No //간략화
            // let Name = req.params.BoardName
                console.log('잘 왔고'+No)

                try {

                    let sql = `DELETE From Content WHERE No = ? `

                    if (No === undefined || No.length <= 0) {
                        JsonResponse.sendJsonResponse(res, 400)
                        return
                    }

                    getContent(No, (err, row) => {
                        //console.log(Name)
                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)
                        }

                        if (row) {
                            console.log(row)
                            db.run(sql, [No], (err) => {
                                if (err) {
                                    console.error(err.message)
                                    JsonResponse.sendJsonResponse(res, 404)
                                

                                    return
                                }
                                JsonResponse.sendJsonResponse(res, 200)  //json은 중괄호로 객체화해서 data보내기              
                                console.log('삭제됨'+No)
                            })
                        }
                        else {
                            JsonResponse.sendJsonResponse(res, 404)
                        }
                    })
                }
                catch (e) {
                    JsonResponse.sendJsonResponse(res, 500)
                
                }
                
            })
            //del 끝

            //편집 누르면 작동!!

            

            app.put('/api/content/modify/:No', function (req, res) {
                let Upload=req.body
                let No=req.params.No
                console.log(Upload,No);
                
                //let Upload = req.body
              //  let No=req.params.No
                /* 넘어온 객체 데이터
                    let data = {
                        no : $scope.inputData.No,
                        //b_sel : $scope.inputData.B_Sel,
                        t_sel : $scope.inputData.T_Sel,
                        s_date: $scope.inputData.start_date,
                        e_date: $scope.inputData.end_date,
                        title :$scope.inputData.Title,
                        main :$scope.inputData.Main,
                    }
                */
                console.log('put start')
               // console.log(Upload)

                try {

                    let sql = `UPDATE Content SET Type = ?,
                                                Start_Date = ?,
                                                End_Date = ?,
                                                Title = ?,
                                                Main = ?,
                                                Name = ?
                            WHERE No = ? `

                    if (Upload === undefined ||  //Upload.no === undefined ||
                        Upload.b_sel === undefined || Upload.b_sel.length <= 0 ||
                        Upload.t_sel === undefined || Upload.t_sel.length <= 0 ||
                        Upload.s_date === undefined || Upload.s_date.length <= 0 ||
                        Upload.e_date === undefined || Upload.e_date.length <= 0 ||
                        Upload.title === undefined || Upload.title.length <= 0 ||
                        Upload.main === undefined || Upload.main.length <= 0) {

                        //console.log(Upload) 
                        //console.log(Upload.no)
                        //console.log(Upload.t_sel)
                        JsonResponse.sendJsonResponse(res, 400)
                        return
                    }

                    getContent(Upload.no, (err, row) => {

                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)
                        }

                        if (row) {
                            console.log(row)
                            db.run(sql, [Upload.t_sel,
                                        Upload.s_date,
                                        Upload.e_date,
                                        Upload.title,
                                        Upload.main,
                                        Upload.b_sel,
                                        No], (err) => { //정의한 sql 순서대로

                                            if (err) {
                                                console.error(err.message)
                                                JsonResponse.sendJsonResponse(res, 404)

                                                return
                                            }
                                            JsonResponse.sendJsonResponse(res, 200)

                                        })
                        }
                        else {
                            JsonResponse.sendJsonResponse(res, 404)
                        }
                    })
                }
                catch (e) {
                    console.log(e)
                    JsonResponse.sendJsonResponse(res, 500)
                }
     
  })
            //put끝


}