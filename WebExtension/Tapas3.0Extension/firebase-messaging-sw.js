// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
		  var config = {
			apiKey: "AIzaSyBcG44HsOq55TM3WkbKUUBcyM6fhiux_B4",
			authDomain: "tapas-7e377.firebaseapp.com",
			databaseURL: "https://tapas-7e377.firebaseio.com",
			projectId: "tapas-7e377",
			storageBucket: "tapas-7e377.appspot.com",
			messagingSenderId: "1030918840491"
		  };

firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {

    console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.data.title; //or payload.notification or whatever your payload is
  var notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: { url:payload.data.click_action }, //the url which we gonna use later
    actions: [{action: "open_url", title: "Read Now"}]
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

