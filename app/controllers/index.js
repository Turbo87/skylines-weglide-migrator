import Controller from '@ember/controller';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { ensureResponseOk } from '../utils/http';

export default class SkylinesController extends Controller {
  @service storage;

  uploadTask = task(async (flight) => {
    let fileName = flight.igcFile.filename;

    let response = await fetch(`https://skylines.aero/files/${fileName}`);
    ensureResponseOk(response);
    let blob = await response.blob();
    let file = new File([blob], fileName);

    let formData = new FormData();
    formData.append('user_id', this.storage.weglide.userId);
    formData.append('date_of_birth', '1970-01-01');
    formData.append('aircraft_id', flight.weglideAircraftId);
    formData.append('file', file);

    response = await fetch(`https://api.weglide.org/v1/igcfile`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Content-Encoding': 'gzip',
      },
    });
    ensureResponseOk(response);

    let flights = await response.json();

    // this does not currently work due to cookie issues

    // let weglideFlightId = flights[0].id;
    //
    // response = await fetch(
    //   `https://api.weglide.org/v1/flightdetail/${weglideFlightId}`,
    //   {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       // co_user_id: 0,
    //       // co_user_name: 'string',
    //       // co_user_date_of_birth: '2023-12-26',
    //       // comment: 'string',
    //       registration: flight.registration,
    //       competition_id: flight.competitionId,
    //     }),
    //     credentials: 'include',
    //   },
    // );
    // ensureResponseOk(response);
    //
    // let flight2 = await response.json();
    // console.log(flight2);

    this.storage.setWeglide({
      userId: this.storage.weglide.userId,
      flights: [...flights, ...this.storage.weglide.flights],
    });
  });
}
