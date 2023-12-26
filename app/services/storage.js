import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const LS_KEY_SKYLINES = 'skylines';
const LS_KEY_WEGLIDE = 'weglide';

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
}
