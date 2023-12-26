import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const LS_KEY_SKYLINES = 'skylines';
const LS_KEY_WEGLIDE = 'weglide';

const TIME_THRESHOLD = 1000 * 60 * 5;

export default class StorageService extends Service {
  @tracked skylines = JSON.parse(localStorage.getItem(LS_KEY_SKYLINES));
  @tracked weglide = JSON.parse(localStorage.getItem(LS_KEY_WEGLIDE));

  setSkylines(data) {
    this.skylines = data;
    localStorage.setItem(LS_KEY_SKYLINES, JSON.stringify(data));
  }

  setWeglide(data) {
    this.weglide = data;
    localStorage.setItem(LS_KEY_WEGLIDE, JSON.stringify(data));
  }

  get flights() {
    let skylinesFlights = this.skylines?.flights;
    let weglideFlights = this.weglide?.flights;
    if (!skylinesFlights || !weglideFlights) {
      return null;
    }

    return skylinesFlights.map((skylinesFlight) => {
      let takeoffTime = Date.parse(skylinesFlight.takeoffTime);
      let landingTime = Date.parse(skylinesFlight.landingTime);

      let weglideFlight = weglideFlights.find((weglideFlight) => {
        if (weglideFlight.scoring_date !== skylinesFlight.scoreDate)
          return false;

        let weglideTakeoffTime = Date.parse(weglideFlight.takeoff_time);
        let takeoffDelta = Math.abs(weglideTakeoffTime - takeoffTime);

        let weglideLandingTime = Date.parse(weglideFlight.landing_time);
        let landingDelta = Math.abs(weglideLandingTime - landingTime);

        return takeoffDelta < TIME_THRESHOLD && landingDelta < TIME_THRESHOLD;
      });

      return { ...skylinesFlight, weglideFlight };
    });
  }
}
