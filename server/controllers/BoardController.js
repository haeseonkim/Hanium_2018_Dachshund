//위치 추가하기.

module.exports = function(app, db) {

    //pk에 해당하는 data 유무 확인
    function getBoard(Name, callback) {
        let sql = `SELECT Location, Name, IsApproval, Reg_Date
                    FROM Board
                    WHERE Name = ? `

        db.get(sql, [Name], callback) //[]대괄호 안에 값을 위에 ? 값에 대입. 

    }

    //전체 조회
    function getAllBoard(callback) { //*보다 명확함
        let sql = `SELECT Location, Name, IsApproval, Reg_Date 
                    FROM Board `

        db.all(sql, [], callback) //모두 조회로 넘길 data가 없으므로 []빈칸.

    }  
    
     //전체 승인
     function allApprove(callback) {
        let sql = 'UPDATE Board SET IsApproval= 1 WHERE IsApproval = 0'

        db.run(sql,[],callback)
    }

    app.put('/api/board', function(req, res) {
        let Board = req.body
        /* 넘어온 객체 데이터
                    let data = {
                Name : $scope.upName,
                Location : $scope.location //js BoardController의 input ng-model에서 받아옴.
            }
        */
       
       if(Board.IsApprove === 1){
        console.log("ok")
        try{
            let sql = `UPDATE Board SET IsApproval = ?`

            if (Board.IsApprove === undefined) { //Board.length <= 0 객체는 길이가 없다.
                JsonResponse.sendJsonResponse(res, 400)
                return
            }

            allApprove(     (err) => {
                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)        
                }
                else {
                    JsonResponse.sendJsonResponse(res, 200) 
                }
            })
        }
        catch(e) {
            JsonResponse.sendJsonResponse(res, 500)  
        }  
    }
        
    else{
        try {

            let sql = `UPDATE Board SET Location = ?, IsApproval = ?                   
                       WHERE Name = ? `

            if (Board === undefined ||Board.Name === undefined|| Board.Location === undefined || Board.IsApproval === undefined ||
                Board.Name.length <= 0 || Board.Location.length <= 0 ) { //Board.length <= 0 객체는 길이가 없다.
                JsonResponse.sendJsonResponse(res, 400)
                return
            }

            getBoard(Board.Name, (err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)        
                }
        
                if (row) {
                    console.log(row)
                    db.run(sql, [Board.Location, Board.IsApproval, Board.Name], (err) => { //정의한 sql 순서대로
                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)
                            
                            return      
                        }
                        JsonResponse.sendJsonResponse(res, 200, Board)                
                        
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
    }
 })

    //get
    app.get('/api/board', function(req, res) {
        //post와 put을 제외한 작업엔 무필요 let location = req.body
        //body에 data가 없으니.

        try {
            //변수 없. 아무것도 안 넘김.
            getAllBoard(     (err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)        
                }
                
                //조회해온 모든 결과를 
                if (row) {
                    console.log(row)
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
    app.delete('/api/board/:Name', function(req, res) { 
        //api/board/뒤에 있는 나머지 url값을 req.params.Name변수에 할당하겠다.
        let Name=req.params.Name //간략화

        try {

            let sql = `DELETE From Board WHERE Name = ? `

            if (Name === undefined || Name.length <= 0 ) {
                JsonResponse.sendJsonResponse(res, 400)
                return
            }

            getBoard(Name, (err, row) => {
                console.log(Name)
                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)        
                }
        
                if (row) {
                    console.log(row)
                    db.run(sql, [Name], (err) => {
                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)
                            
                            return      
                        }
                        JsonResponse.sendJsonResponse(res, 200, {Name:Name})  //json은 중괄호로 객체화해서 data보내기              
                        
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
}