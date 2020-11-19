module.exports = function (app, db) {

    //��ü ��ȸ
    function getAllRotation(callback) { //*���� ��Ȯ��
        let sql = `SELECT Ro_Text, Ro_Image, Ro_Media
                    FROM Content_Rotation `

        db.all(sql, [], callback) //��� ��ȸ�� �ѱ� data�� �����Ƿ� []��ĭ.

    }

    //put ����
    app.put('/api/content/rotation', function (req, res) {
        let ro = req.body
        //-> requestfactory���� url�� �Բ� ���� data�̴�.
        /* RotationController���� ������ ������ ������
        html���� input method�� ���� �Ѱܹ޾ƿ�
        ���� ������ �ٽ� ������ ��ü ������
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
                    db.run(sql, [ro.Text, ro.Image, ro.Media], (err) => { //������ sql �������
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

    //put ��

    //get
    app.get('/api/content/rotation', function (req, res) {
        //post�� put�� ������ �۾��� ���ʿ� let location = req.body
        //body�� data�� ������.

        try {
            //���� ��. �ƹ��͵� �� �ѱ�.
            getAllRotation((err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)
                }

                //��ȸ�ؿ� ��� ����� 
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
    //get ��



}