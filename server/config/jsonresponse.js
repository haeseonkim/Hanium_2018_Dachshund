var JsonResponse = {
    sendJsonResponse: function(res, responseStatus, data = {}) {
       switch(responseStatus) {
           case 200:
               res.status(200);
               res.json(data);
               break;

           case 302:
               res.status(302);
               res.json({
                   'status': 302,
                   'message': 'Found'
               });
               break;
 
           case 400:
               res.status(400);
               res.json({
                   'status': 400,
                   'message': 'Bad request'
               });
               break;

           case 401:
               res.status(401);
               res.json({
                   'status': 401,
                   'message': 'Invalid credentials'
               });
               break;


           case 404:
               res.status(404);
               res.json({
                   'status': 404,
                   'message': 'Not found'
               });
               break;

           default: 
               res.status(500);
               res.json({
                   'status': 500,
                   'message': 'Internal server error'
               });
               break;
       }
    }
};

module.exports = JsonResponse;
