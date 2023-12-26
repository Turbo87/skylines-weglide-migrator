const fs = require('fs');

function run() {
  let skylines = require('./skylines-aircraft.json');
  let weglide = require('./weglide-aircraft.json');

  for (let aircraft of skylines.models) {
    let weglideAircraft = weglide.find((wga) => wga.name === aircraft.name);
    if (weglideAircraft) {
      aircraft.weglideId = weglideAircraft.id;
    }
  }

  fs.writeFileSync(
    './skylines-aircraft.json',
    JSON.stringify(skylines, null, 2),
  );
}

run();
