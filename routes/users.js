const express = require('express');
const router = express.Router();
const sendSms = require('./twilio');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

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
router.post('/create', (req, res, next) => {
  let phoneNumber = `+1${req.body.phoneNumber}`;
  console.log(phoneNumber);

  // console.log(req.body.accessCode);
  //Check if the phoneNumber is in database
  // validPhoneNumber = usersCollection.where('phoneNumber', '==', phoneNumber);
  // validPhoneNumber.get().then(querySnapshot => {
  //   querySnapshot.forEach(doc => {
  //     console.log(doc.id, ' => ', doc.data());
  //     console.log(phoneNumber);
  //     //Check if the phoneNumber is in database
  //     if (doc.data().phoneNumber == req.body.phoneNumber) {
  //       console.log(doc.data());
  //       doc
  //         .delete()
  //         .then(() => {
  //           console.log('deleted successfully');
  //         })
  //         .catch(error => {
  //           console.log('Error removing document: ', error);
  //         });
  //       // res.json({
  //       //   message: 'phoneNumber is exist',
  //       // });
  //       // doc.delete();
  //       // res.json({
  //       //   message: 'delete user',
  //       // });
  //     }
  //   });
  if (phoneNumber.length < 12 && phoneNumber.length > 15) {
    let docId = Math.floor(Math.random() * (99999 - 00000));

    //Generate 6 random digits accessCode
    let accessCode2 = Math.floor(Math.random() * (999999 - 000000));
    const welcomeMessage = `Welcome to Skipli! Your access code is ${accessCode2}`;
    console.log(accessCode2);
    let newUser = {
      phoneNumber: phoneNumber,
      accessCode: accessCode2, //Put in firebase database
    };
    //send the user to firestore with new accessCode
    let setNewUser = usersCollection.doc(String(docId)).set(newUser);
    console.log(setNewUser);

    sendSms(newUser.phoneNumber, welcomeMessage);

    res.json({
      message: 'user was successfully created and sent code!',
    });
  } else {
    res.json({
      message: 'Wrong phone number input',
    });
  }
});

//POST REQUEST
//VALIDATE ACCESS CODE
router.post('/users/', (req, res, next) => {
  // let reqId = req.params.id;
  let accessCode = req.body.accessCode;
  let phoneNumber = req.body.phoneNumber;
  // console.log(phoneNumber);
  //Check if the json object is not null or empty
  if (req.body.accessCode.length > 0) {
    validation = usersCollection.where('phoneNumber', '==', phoneNumber);

    validation.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
        if (doc.data().accessCode == accessCode) {
          res.json({
            message: 'access code matched - Login the user',
          });
        } else {
          res.json({
            message: 'access code DOES NOT match',
          });
        }
      });
    });
  }
}),
  //PUT requests
  //Update users phoneNumber
  router.put('/users/', (req, res, next) => {
    let userId = req.params.id;

    let transaction = db
      .runTransaction(async transaction => {
        const doc = await transaction.get(usersCollection);
        if (req.body.phoneNumber.length > 0) {
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
