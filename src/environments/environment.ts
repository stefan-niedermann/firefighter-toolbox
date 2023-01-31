// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  calendars: new Map<string, Map<string, string>>([
    [
      'Aurachhöhe', new Map([
        ['Termine', 'webcal://cloud.feuerwehr-aurachhoehe.de/remote.php/dav/public-calendars/G9atMmaTroAGoaYN/?export'],
        ['Jugend', 'webcal://cloud.feuerwehr-aurachhoehe.de/remote.php/dav/public-calendars/cpirkA8bg4S8iWJm/?export'],
        ['Bambini', 'webcal://cloud.feuerwehr-aurachhoehe.de/remote.php/dav/public-calendars/jbTrtWddCqkqqaL8/?export']
      ])
    ],
    [
      'Kammerstein', new Map([
        ['Aktive', 'webcal://cloud.feuerwehr-aurachhoehe.de/remote.php/dav/public-calendars/QWFCbxENtEBNFpCq?export'],
        ['Jugend', 'webcal://cloud.feuerwehr-aurachhoehe.de/remote.php/dav/public-calendars/73WSH63T4FFdwSPQ?export'],
        ['Kinder', 'webcal://cloud.feuerwehr-aurachhoehe.de/remote.php/dav/public-calendars/KxFsBxEjRZg9ZgEf?export']
      ]),
    ]
  ])
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
