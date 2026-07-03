import { types, flow } from 'mobx-state-tree';
import axios from 'axios';
import { MeterModel } from './models/meters';

const METERS_URL = '/api/meters/';

export const MeterStore = types
  .model('MeterStore', {
    meters: types.array(MeterModel),
    isLoading: false,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    fetchMeters: flow(function* () {
      self.isLoading = true;
      self.error = null;
      try {
        const response = yield axios.get(METERS_URL);
        self.meters = response.data.results;
      } catch (error) {
        self.error = String(error);
      } finally {
        self.isLoading = false;
      }
    }),
    deleteMeter: flow(function* (id: string) {
      self.error = null;
      try {
        yield axios.delete(`${METERS_URL}${id}/`);
        self.meters.replace(self.meters.filter((m) => m.id !== id));
      } catch (error) {
        self.error = `Не удалось удалить счётчик: ${error}`;
      }
    }),
  }));
