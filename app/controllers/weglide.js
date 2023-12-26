import Controller from '@ember/controller';
import { task, dropTask, rawTimeout, restartableTask } from 'ember-concurrency';
import { loadAllWeglideFlights, loadUserDetails } from '../utils/weglide';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const DEBOUNCE_MS = 100;

export default class SkylinesController extends Controller {
  @service storage;

  @tracked dateOfBirth;

  constructor() {
    super(...arguments);
    if (this.storage.weglide) {
      this.dateOfBirth = this.storage.weglide.dateOfBirth;
      this.getUserDetailsTask
        .perform(this.storage.weglide.userId)
        .catch(() => {});
    }
  }

  get submitDisabled() {
    return (
      !this.getUserDetailsTask.last?.isSuccessful || this.importTask.isRunning
    );
  }

  onInputTask = restartableTask(async (event) => {
    await rawTimeout(DEBOUNCE_MS);

    let userId = event.target.value;
    try {
      await this.getUserDetailsTask.perform(userId);
    } catch (error) {
      console.error(error);
    }
  });

  getUserDetailsTask = restartableTask(async (userId) => {
    if (!isValidUserId(userId)) {
      throw new Error('Invalid user ID');
    }

    return await loadUserDetails(userId);
  });

  @action
  setDateOfBirth(event) {
    this.dateOfBirth = event.target.value;
  }

  onSubmitTask = task(async (event) => {
    event.preventDefault();
    await this.importTask.perform();
  });

  importTask = dropTask(async () => {
    let userId = this.getUserDetailsTask.last.value.id;
    let dateOfBirth = this.dateOfBirth;
    this.storage.setWeglide({ userId, dateOfBirth });

    let flights = await loadAllWeglideFlights(userId);
    this.storage.setWeglide({ userId, dateOfBirth, flights });
  });
}

function isValidUserId(userId) {
  return /^\d+$/.test(userId);
}
