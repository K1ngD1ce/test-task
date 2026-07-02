import { types } from 'mobx-state-tree';

export const MeterModel = types.model('Meter', {
  id: types.identifier,
  _type: types.array(types.string),
  area: types.model({
    id: types.string,
  }),
  is_automatic: types.maybeNull(types.boolean),
  communication: types.maybeNull(types.string),
  description: types.string,
  serial_number: types.string,
  installation_date: types.maybeNull(types.string),
  brand_name: types.maybeNull(types.string),
  model_name: types.maybeNull(types.string),
  initial_values: types.array(types.number),
});
