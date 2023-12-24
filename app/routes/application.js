import Route from '@ember/routing/route';
import { loadAllWeglideFlights } from '../utils/weglide';
import { loadAllSkylinesFlights } from '../utils/skylines';

export default class ApplicationRoute extends Route {
  async model() {
    let weglideFlights = await loadAllWeglideFlights(1);
    console.log(weglideFlights);

    let skylinesFlights = await loadAllSkylinesFlights(31);
    console.log(skylinesFlights);
  }
}
