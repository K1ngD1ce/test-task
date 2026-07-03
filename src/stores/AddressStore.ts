import axios from 'axios';
import { types, flow } from 'mobx-state-tree';
import { AddressModel } from './models/address';

const AREAS_URL = '/api/areas/';

export const AddressStore = types
  .model('AddressStore', {
    addresses: types.array(AddressModel),
  })
  .views((self) => ({
    get addressMap() {
      return new Map(self.addresses.map((a) => [a.id, a]));
    },
  }))
  .actions((self) => ({
    fetchMissingAddresses: flow(function* (areaIds: string[]) {
      const existingIds = new Set(self.addresses.map((a) => a.id));
      const missingIds = [
        ...new Set(areaIds.filter((id) => !existingIds.has(id))),
      ];

      if (!missingIds.length) return;

      const params = new URLSearchParams();
      missingIds.forEach((id) => params.append('id__in', id));

      try {
        const response = yield axios.get(`${AREAS_URL}?${params.toString()}`);
        self.addresses.push(...response.data.results);
      } catch (error) {
        console.error('Не удалось загрузить адреса', error);
      }
    }),
  }));
