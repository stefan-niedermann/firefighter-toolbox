export const environment = {
  production: true,
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
