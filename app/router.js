import EmberRouter from '@ember/routing/router';
import config from 'skylines-weglide-migrator/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('skylines');
  this.route('weglide');
});
