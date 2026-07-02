import { types, flow } from 'mobx-state-tree';
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

        const existingIds = new Set(
          self.addresses.map((address) => address.id)
        );

        const missingIds = [
          ...new Set(
            self.meters
              .map((meter) => meter.area.id)
              .filter((id) => !existingIds.has(id))
          ),
        ];

        console.log('Будут загружены:', missingIds);

        if (missingIds.length) {
          const params = new URLSearchParams();

          missingIds.forEach((id) => {
            params.append('id__in', id);
          });

          const addressesRes = yield axios.get(
            `${AREAS_URL}?${params.toString()}`
          );

          console.log('Получено адресов:', addressesRes.data.results);

          self.addresses.push(...addressesRes.data.results);
        }
      } catch (error) {
        self.error = `Ошибка ${error}`;
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
        self.meters.replace(self.meters.filter((meter) => meter.id !== id));

        const maxPage = Math.max(1, Math.ceil(self.meters.length / PAGE_SIZE));

        if (self.currentPage > maxPage) {
          self.currentPage = maxPage;
        }
      } catch (error) {
        self.error = `Не удалось удалить счётчик: ${error}`;
      }
    }),
  }))
  .views((self) => ({
    get addressesMap() {
      return new Map(self.addresses.map((address) => [address.id, address]));
    },

    get metersWithAdresses() {
      return self.meters.map((meter) => {
        const address = this.addressesMap.get(meter.area.id);

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
    },
  }))
  .views((self) => ({
    get totalPages() {
      return Math.ceil(self.metersWithAdresses.length / PAGE_SIZE) || 1;
    },

    get paginationMeters() {
      const start = (self.currentPage - 1) * PAGE_SIZE;
      return self.metersWithAdresses.slice(start, start + PAGE_SIZE);
    },

    get pageNumbers(): (number | '...')[] {
      const total = this.totalPages;

      if (total <= 6) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      return [1, 2, 3, '...', total - 2, total - 1, total];
    },
  }));

export const store = MeterStore.create({
  meters: [],
  addresses: [],
  isLoading: false,
  error: null,
  currentPage: 1,
});
