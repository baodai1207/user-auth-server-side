const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');

const serviceAcc = require('../keyfile.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAcc),
});

const db = admin.firestore();

const usersCollection = db.collection('users');
//GET all users
router.get('/users', (req, res, next) => {
  let allUsers = [];
  usersCollection
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        allUsers.push({
          docID: doc.id,
          userData: doc.data(),
        });
      });
      res.json({
        statusCode: '200',
        statusResponse: 'OK',
        message: 'All users',
        data: allUsers,
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
});
//Get User by ID
router.get('/users/:id', (req, res, next) => {
  let reqId = req.params.id;
  usersCollection
    .doc(reqId)
    .get()
    .then(doc => {
      if (doc.exists) {
        res.json({
          statusCode: '200',
          statusResponse: 'OK',
          message: 'User found',
          userData: doc.data(),
        });
      } else {
        res.json({
          statusCode: '404',
          statusResponse: 'Not found',
          message: 'User not found',
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

//POST requests
//Create User, CREATE NEW ACCESS CODE
router.post('/users', (req, res, next) => {
  console.log(req.phoneNumber);

  let docId = Math.floor(Math.random() * (99999 - 00000));
  //Check if the json object doesn't have accessCode
  if (
    (req.body.phoneNumber != null && req.body.accessCode == null) ||
    (req.body.phoneNumber != undefined && req.body.accessCode == undefined)
  ) {
    //Generate 6 random digits accessCode
    let accessCode = Math.floor(Math.random() * (999999 - 000000));
    let newUser = {
      phoneNumber: req.body.phoneNumber,
      accessCode: accessCode,
    };
    //send the user to firestore with new accessCode
    let setNewUser = usersCollection.doc(String(docId).set(newUser));
    res.json({
      message: 'user was successfully created',
    });
  } else {
    res.json({
      message: 'req.body params are undefined',
    });
  }
});

//POST REQUEST
//VALIDATE ACCESS CODE
router.post('/users', (req, res, next) => {
  //Check if the json object is not null or empty
  if (
    (req.body.phoneNumber != null && req.body.accessCode != null) ||
    (req.body.phoneNumber != undefined && req.body.accessCode != undefined) // Dont need email check, create a empty string to generate 6 random digits
  ) {
    //listen to the collection of users
    db.collection('users')
      //"where" clause we have control over what data comes back
      .where('accessCode', '==', req.body.accessCode)
      .onSnapshot(function (snap) {
        snap.forEach(function (doc) {
          console.log(doc.data());
        });
        //compare if accessCode from user is the same with accessCode generated
        if (doc.data() == req.body.accessCode) {
        }
      });

    let newUser = {
      phoneNumber: req.body.phoneNumber,
      accessCode: req.body.accessCode,
    };
    //send the user to firestore
    let setNewUser = usersCollection.doc(String(docId)).set(newUser);
  }
}),
  //PUT requests
  //Update users phoneNumber
  router.put('/user/:id', (req, res, next) => {
    let userId = req.params.id;

    let transaction = db
      .runTransaction(transaction => {
        return transaction.get(usersCollection).then(doc => {
          if (
            req.body.phoneNumber != undefined &&
            req.body.accessCode != undefined //Generate 6 digits random for accessCode
          ) {
            //pass the data as an object here
            transaction.update(usersCollection.doc(userId), {
              phoneNumber: req.body.phoneNumber,
              accessCode: req.body.accessCode,
            });
          } else {
            res.json({
              statusCode: '505',
              statusResponse: 'Error parsing the data',
              message: 'There is no data to parse',
            });
          }
        });
      })
      .then(result => {
        res.json({
          statusCode: '200',
          statusResponse: 'OK',
          message: 'Transaction Success',
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

//DELETE requests
//Just need to parse the ID and the user will be deleted
router.delete('/users/:id', (req, res, next) => {
  deleteDoc = usersCollection.doc(req.params.id).delete();
  res.json({
    message: 'User was deleted successfully',
  });
});

module.exports = router;
