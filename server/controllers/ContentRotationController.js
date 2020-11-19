module.exports = function (app, db) {

    //전체 조회
    function getAllRotation(callback) { //*보다 명확함
        let sql = `SELECT Ro_Text, Ro_Image, Ro_Media
                    FROM Content_Rotation `

        db.all(sql, [], callback) //모두 조회로 넘길 data가 없으므로 []빈칸.

    }

    //put 시작
    app.put('/api/content/rotation', function (req, res) {
        let ro = req.body
        //-> requestfactory에서 url과 함께 보낸 data이다.
        /* RotationController에서 정의한 스코프 변수를
        html에서 input method를 통해 넘겨받아와
        편한 변수로 다시 정의한 객체 데이터
            let data = {
                Text : $scope.ro.Text,
                Image : $scope.ro.Image,
                Media : $scope.ro.Media
            }
        */

        try {

            let sql = `UPDATE Content_Rotation SET
                        Ro_Text = ?,
                        Ro_Image = ?,
                        Ro_Media = ?`


            if (ro === undefined || ro.Text === undefined || ro.Image === undefined || ro.Media === undefined) {
                JsonResponse.sendJsonResponse(res, 400)
                return
            }

            getAllRotation((err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)
                }

                if (row) {
                    console.log(row)
                    db.run(sql, [ro.Text, ro.Image, ro.Media], (err) => { //정의한 sql 순서대로
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

    //put 끝

    //get
    app.get('/api/content/rotation', function (req, res) {
        //post와 put을 제외한 작업엔 무필요 let location = req.body
        //body에 data가 없으니.

        try {
            //변수 없. 아무것도 안 넘김.
            getAllRotation((err, row) => {

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



}