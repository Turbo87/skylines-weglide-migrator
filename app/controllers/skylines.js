import Controller from '@ember/controller';
import { task, dropTask, rawTimeout, restartableTask } from 'ember-concurrency';
import { getJson } from '../utils/http';
import { loadAllSkylinesFlights } from '../utils/skylines';

const DEBOUNCE_MS = 100;

export default class SkylinesController extends Controller {
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

    let { json } = await getJson(`https://skylines.aero/api/users/${userId}`);
    return json;
  });

  onSubmitTask = task(async (event) => {
    event.preventDefault();
    await this.importTask.perform();
  });

  importTask = dropTask(async () => {
    let userId = this.getUserDetailsTask.last.value.id;
    let flights = await loadAllSkylinesFlights(userId);
    console.log(flights);
  });
}

function isValidUserId(userId) {
  return /^\d+$/.test(userId);
}
