module.exports = (router, expressApp, authRoutesMethods, models, accessTokenDBHelper) => {

  //API Auth
  
  router.post('/registerUser', authRoutesMethods.registerUser);

  router.post('/login', expressApp.oauth.grant());

  router.post('/decodeToken', (req, res) => {
    accessTokenDBHelper.getUserIDFromBearerToken(req.body.access_token, (user_id) => {
      if (user_id) {
        res
          .status(200)
          .json({
            'user_id': user_id,
          });
      } else {
        res
          .status(500)
          .json({
            'message': 'User not found',
          });
      }
    });
  });

  //API users

  router.get('/users',  expressApp.oauth.authorise(), (req, res) => {
    models.users.findAll({
    }).then(users => res.json(users));
  });
  
  router.get('/users/:id',  expressApp.oauth.authorise(), (req,res) => {
    const ID = req.params.id;
    models.users.findAll({
      where: { id: ID }
    }).then(users => res.json(users));
  });

  router.delete('/users/:id', expressApp.oauth.authorise(), (req, res) => {
    const ID = req.params.id;
    models.users.destroy({
      where: {id: ID},
      force: true
    }).then(() => {
      res.json({message: "Deleted Successfully!", code:'200'});
    }).catch((err) => {
      res.json({ message: "Error", code: '500', error: err });
    });
  });
    
  router.put('/users/:id', expressApp.oauth.authorise(), (req,res) => {
    const ID = req.params.id;
    models.users.update({
      name: req.body.name
    },{
      where: {id: ID},
      force: true
    }).
    then(() => {
      res.json({ message: "Successfully updated user data!", code: '200' })
    }).catch((err) => {
      res.json({ message: "Error", code: '500', error:err });
    });
  });


  //API Clients
  router.post('/clients', expressApp.oauth.authorise(), (req, res) => {
    ///dorobic IF ze ten sam pesel juz inisteje
    var data = models.clients.build({
      name: req.body.name,
      lastName: req.body.lastName,
      pesel: req.body.pesel
    });
    data.save().then(() => {
      res.json({ message: "Successfully added client to database!", code: '200' })
    })
      .catch((err) => {
        res.json({ message: "The client could not be added to the database!", code: '500', error: err })
      });
  });


  router.get('/clients',  expressApp.oauth.authorise(), (req, res) => {
    models.clients.findAll({
    }).then(clients => res.json(clients));
  });
  

  router.get('/clients/:id',  expressApp.oauth.authorise(), (req,res) => {
    const ID = req.params.id;
    models.clients.findAll({
      where: { id: ID }
    }).then(clients => res.json(clients));
  });


  router.put('/clients/:id', expressApp.oauth.authorise(), (req,res) => {
    const ID = req.params.id;
    models.clients.update({
      name: req.body.name,
      lastName: req.body.lastName,
      pesel: req.body.pesel
    },{
      where: {id: ID},
      force: true
    }).
    then(() => {
      res.json({ message: "Successfully updated clients data!", code: '200' })
    }).catch((err) => {
      res.json({ message: "Error", code: '500', error:err });
    });
  });


  router.delete('/clients/:id', expressApp.oauth.authorise(), (req, res) => {
    const ID = req.params.id;
    models.clients.destroy({
      where: {id: ID},
      force: true
    }).then(() => {
      res.json({message: "Deleted Successfully!", code:'200'});
    }).catch((err) => {
      res.json({ message: "Error", code: '500', error: err });
    });
  });




    return router
  }
  