import Controller from '@ember/controller';
import { task, dropTask, rawTimeout, restartableTask } from 'ember-concurrency';
import { loadAllWeglideFlights, loadUserDetails } from '../utils/weglide';
import { service } from '@ember/service';

const DEBOUNCE_MS = 100;

export default class SkylinesController extends Controller {
  @service storage;

  constructor() {
    super(...arguments);
    if (this.storage.weglide) {
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

  onSubmitTask = task(async (event) => {
    event.preventDefault();
    await this.importTask.perform();
  });

  importTask = dropTask(async () => {
    let userId = this.getUserDetailsTask.last.value.id;
    this.storage.setWeglide({ userId });

    let flights = await loadAllWeglideFlights(userId);
    this.storage.setWeglide({ userId, flights });
  });
}

function isValidUserId(userId) {
  return /^\d+$/.test(userId);
}
