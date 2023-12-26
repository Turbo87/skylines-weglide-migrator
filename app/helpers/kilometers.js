import { helper } from '@ember/component/helper';

export default helper(function kilometers(positional /*, named*/) {
  return Math.round(positional / 1000) + ' km';
});
