importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAk_wibxRd7khsmCcJKtFhFKMCTQSHyjz0",
  authDomain: "airyy-33c41.firebaseapp.com",
  projectId: "airyy-33c41",
  storageBucket: "airyy-33c41.appspot.com",
  messagingSenderId: "16083037423",
  appId: "1:16083037423:web:ba5f0932f479ca8fae7f1a",
  measurementId: "G-ZGHJX7KFE9",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  console.log('Notification title:', notificationTitle);
  console.log('Notification options:', notificationOptions);

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => console.log('Notification displayed successfully'))
    .catch(error => console.error('Error displaying notification:', error));
});