const fs = require('fs');

function run() {
  let skylines = require('./skylines-aircraft.json');
  let data = skylines.models.map(({ id, weglideId }) => ({ id, weglideId }));
  let json = JSON.stringify(data, null, 2);
  let content = `const DATA = ${json};\nexport default DATA;`;
  fs.writeFileSync(__dirname + '/../app/data/aircraft.js', content);
}

run();
