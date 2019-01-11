// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyAJZ1spjq9VVRrtr1W2eEoveb8ovq5ts7w',
    authDomain: 'texla-anzio.firebaseapp.com',
    databaseURL: 'https://texla-anzio.firebaseio.com',
    projectId: 'texla-anzio',
    storageBucket: 'texla-anzio.appspot.com',
    messagingSenderId: '265908819571'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
