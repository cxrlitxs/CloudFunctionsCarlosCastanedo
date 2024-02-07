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


//URL para probar
//https://deletepost-5ix5bbunda-uc.a.run.app/?postId=omHRgBnN82dYPD9bQS13

exports.deletePost = onRequest(async (req, res) => {
  // Obtener el ID del elemento a eliminar de los parámetros de consulta
  const postId = req.query.postId;

  if (!postId) {
      return res.status(400).send('ID del post requerido');
  }

  try {
    //Localizar el post con el Id
    const docRef = getFirestore().collection("pruebaPosts").doc(postId);

    // Verificar si el documento existe
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send(`No se encontró el elemento con ID: ${postId}`);
    }

      // Eliminar el elemento de Firestore solo si existe
      await docRef.delete();

      // Enviar respuesta confirmando la eliminación
      res.json({ result: `El elemento con ID: ${postId} se eliminó correctamente.` });
  } catch (error) {
      console.error("Error al eliminar el post: ", error);
      res.status(500).send('Error al eliminar el post');
  }
});