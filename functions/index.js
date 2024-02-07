/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

 //firebse deploy --only functions

 // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");

initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

 exports.helloWorld = onRequest((request, response) => {
   logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });


 //URL para probar
 //https://addpost-5ix5bbunda-uc.a.run.app/?nickName=carlos&body=holaa&title=prueba

 exports.addpost = onRequest(async (req, res) => {
  // Grab the text parameter.
  const nickName = req.query.nickName;
  const body = req.query.body;
  const title = req.query.title;

  // Usar FieldValue.serverTimestamp() para obtener el timestamp del servidor
  const timestamp = FieldValue.serverTimestamp();

  try{
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
      .collection("pruebaPosts")
      .add({nickName: nickName, title: title, body: body});

  const listaPost = await getFirestore()
      .collection("pruebaPosts")
      .get();

      const arrayPost = [];
      var i = 0;
      listaPost.forEach(doc => {
        arrayPost[i] = doc.data.toString();
        i++;
      });
  // Send back a message that we've successfully written the message
  res.json({result: `Post con ID: ${writeResult.id} fue insertado correctamente.`});
  } catch (error){
    console.error("Error al insertar el mensaje: ", error);
    res.status(500).send('Error al insertar el post')
  }
});