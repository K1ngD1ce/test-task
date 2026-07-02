import { types } from 'mobx-state-tree';
import { MeterStore } from './MeterStore';

export const RootStore = types.model('RootStore', {
  meterStore: MeterStore,
});
