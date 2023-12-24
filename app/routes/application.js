import Route from '@ember/routing/route';
import { loadAllWeglideFlights } from '../utils/weglide';

export default class ApplicationRoute extends Route {
  async model() {
    let weglideFlights = await loadAllWeglideFlights(1);
    console.log(weglideFlights);
  }
}
