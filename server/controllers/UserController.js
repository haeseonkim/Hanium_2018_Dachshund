module.exports = function (app, db) {


    function getUser(id, password, callback) {
        let sql = `SELECT Init_id, User_Password
                    FROM User
                    WHERE Init_id = ? AND User_Password = ?`

        db.get(sql, [id, password], callback)

    }

    function updateUser(user, callback) {
    }


    //real)post
    app.post('/login', function (req, res) {
        let user = req.body


        try {
            if (user === undefined || user.userId === undefined || user.password === undefined ||
                user.userId.length <= 0 || user.password.length <= 0) {
                JsonResponse.sendJsonResponse(res, 400)
                return
            }

            getUser(user.userId, user.password, (err, row) => {
                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)
                    // res.status(404).json({message: 'error'})        
                }

                if (row) {
                    req.session.user = req.body.userId
                    req.session.cookie.originalMaxAge = env.session.maxAge
                    req.session.cookie._expires = new Date(Date.now() + env.session.maxAge)
                    JsonResponse.sendJsonResponse(res, 200, { userId: row.Init_Id })
                    // res.json(row)
                }
                else {
                    JsonResponse.sendJsonResponse(res, 404)
                    //res.status(404).json({message: 'not found'})    
                }


            })
        } catch (e) {
            JsonResponse.sendJsonResponse(res, 500)
            // res.status(500).json({message: 'server error'})   
        }
    })


    //real)delete
    app.delete('/api/logout', function (req, res) {
        try {
            if (req.session) {
                req.session.destroy(function () {
                    req.session = null;
                });
                req.session = null;
            }

            JsonResponse.sendJsonResponse(res, 200, {});
        }
        catch (e) {
            if (req.session) {
                req.session.destroy(function () {
                    req.session = null;
                });
                req.session = null;
            }

            JsonResponse.sendJsonResponse(res, 200, {});
        }
    })


    //real)put
    app.put('/api/user', function (req, res) {
        let user = req.body


        try {

            let sql = `UPDATE User SET User_Password = ?
                       WHERE Init_id = ? AND User_Password = ?` //한 row에 있는지 확인.


            if (user === undefined || user.userId === undefined || user.current_password === undefined || user.new_password === undefined ||
                user.userId.length <= 0 || user.current_password.length <= 0 || user.new_password.length <= 0) {
                JsonResponse.sendJsonResponse(res, 400)
                return
            }

            getUser(user.userId, user.current_password, (err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)
                }

                if (row) {
                    db.run(sql, [user.new_password, user.userId, user.current_password], (err) => {
                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)

                            return
                        }

                        JsonResponse.sendJsonResponse(res, 200, { userId: user.userId, })

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

    /*
    //mine
//id중복 여부를 확인 후 있으면 fale 없으면 update!
    app.insert('/login', function(req, res) {
        let user = req.body

    
        try {
            if(1){
                console.log('in')
            let id = `INSERT INTO User (Init_Id) VALUES ('user.userId')`
            }
            let sql = `UPDATE User SET User_Password = ?                   
                       WHERE Init_id = ? AND User_Password = ?`


            if (user === undefined || user.userId === undefined || user.current_password === undefined || user.new_password === undefined ||
                user.userId.length <= 0 || user.current_password.length <= 0 || user.new_password.length <= 0) {
                JsonResponse.sendJsonResponse(res, 400)
                return
            }

            getUser(user.userId, user.current_password, (err, row) => {

                if (err) {
                    console.error(err.message)
                    JsonResponse.sendJsonResponse(res, 404)        
                }
        
                if (row) {
                    db.run(sql, [user.new_password, user.userId, user.current_password], (err) => {
                        if (err) {
                            console.error(err.message)
                            JsonResponse.sendJsonResponse(res, 404)
                            
                            return      
                        }
        
                        JsonResponse.sendJsonResponse(res, 200, {userId: user.userId})                
                        
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
    */
    //id 체크 끝

}
