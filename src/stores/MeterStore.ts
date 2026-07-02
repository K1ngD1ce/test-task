import { types, flow } from 'mobx-state-tree';
import type { Instance } from 'mobx-state-tree';
import axios from 'axios';

import { MeterModel } from './models/meters';
import { AddressModel } from './models/address';

const PAGE_SIZE = 20;

const METERS_URL = '/api/meters/';
const AREAS_URL = '/api/areas/';

export const MeterStore = types
  .model('MeterStore', {
    meters: types.array(MeterModel),
    addresses: types.array(AddressModel),
    isLoading: false,
    error: types.maybeNull(types.string),
    currentPage: types.optional(types.number, 1),
  })

  .actions((self) => ({
    fetchAllData: flow(function* () {
      self.isLoading = true;

      try {
        const metersRes = yield axios.get(METERS_URL);
        self.meters = metersRes.data.results;

        const existingIds = new Set(self.addresses.map((a) => a.id));

        const missingIds = [
          ...new Set(
            self.meters
              .map((m) => m.area.id)
              .filter((id) => !existingIds.has(id))
          ),
        ];

        console.log('Будут загружены:', missingIds);

        if (missingIds.length) {
          const params = new URLSearchParams();
          missingIds.forEach((id) => params.append('id__in', id));

          const addressesRes = yield axios.get(
            `${AREAS_URL}?${params.toString()}`
          );
          console.log('Получено адресов:', addressesRes.data.results);
          self.addresses.push(...addressesRes.data.results);
        }
      } catch (e) {
        self.error = String(e);
      } finally {
        self.isLoading = false;
      }
    }),

    setPage(page: number) {
      self.currentPage = page;
    },

    deleteMeter: flow(function* (id: string) {
      try {
        yield axios.delete(`${METERS_URL}${id}/`);

        self.meters.replace(self.meters.filter((m) => m.id !== id));

        const maxPage = Math.max(1, Math.ceil(self.meters.length / PAGE_SIZE));

        if (self.currentPage > maxPage) {
          self.currentPage = maxPage;
        }
      } catch (e) {
        self.error = `Не удалось удалить счётчик: ${e}`;
      }
    }),
  }))

  .views((self) => {
    const addressesMap = () => new Map(self.addresses.map((a) => [a.id, a]));

    const metersWithAddresses = () =>
      self.meters.map((meter) => {
        const address = addressesMap().get(meter.area.id);

        return {
          id: meter.id,
          _type: meter._type,
          serial_number: meter.serial_number,
          installation_date: meter.installation_date,
          is_automatic: meter.is_automatic,
          description: meter.description,
          initial_values: meter.initial_values,
          fullAddress: address
            ? `${address.house.address}, ${address.str_number_full}`
            : 'Адрес не указан',
        };
      });

    return {
      get addressesMap() {
        return addressesMap();
      },

      get metersWithAdresses() {
        return metersWithAddresses();
      },

      get totalPages() {
        return Math.ceil(metersWithAddresses().length / PAGE_SIZE) || 1;
      },

      get paginationMeters() {
        const start = (self.currentPage - 1) * PAGE_SIZE;

        return metersWithAddresses().slice(start, start + PAGE_SIZE);
      },

      get pageNumbers(): (number | '...')[] {
        const total = Math.ceil(metersWithAddresses().length / PAGE_SIZE);

        const current = self.currentPage;

        if (total <= 6) {
          return Array.from({ length: total }, (_, i) => i + 1);
        }

        const delta = 1;

        const range: number[] = [];

        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        for (let i = left; i <= right; i++) {
          range.push(i);
        }

        const result: (number | '...')[] = [];

        result.push(1);

        if (left > 2) result.push('...');

        result.push(...range);

        if (right < total - 1) result.push('...');

        result.push(total);

        return result;
      },
    };
  });

export type TMeterStore = Instance<typeof MeterStore>;

export const store = MeterStore.create({
  meters: [],
  addresses: [],
  isLoading: false,
  error: null,
  currentPage: 1,
});
