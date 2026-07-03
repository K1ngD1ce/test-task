import { types, flow } from 'mobx-state-tree';
import type { Instance } from 'mobx-state-tree';
import { MeterStore } from './MeterStore';
import { AddressStore } from './AddressStore';
import { PaginationStore } from './PaginationStore';

export const RootStore = types
  .model('RootStore', {
    meterStore: types.optional(MeterStore, {}),
    addressStore: types.optional(AddressStore, {}),
    pagination: types.optional(PaginationStore, {}),
  })
  .views((self) => ({
    get metersWithAddresses() {
      return self.meterStore.meters.map((meter) => {
        const address = self.addressStore.addressMap.get(meter.area.id);
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
      return self.pagination.getTotalPages(self.metersWithAddresses.length);
    },
    get paginationMeters() {
      return self.pagination.getPageSlice(self.metersWithAddresses);
    },
  }))
  .views((self) => ({
    get pageNumbers() {
      return self.pagination.getPageNumbers(self.totalPages);
    },
  }))
  .actions((self) => ({
    fetchAllData: flow(function* () {
      yield self.meterStore.fetchMeters();
      const areaIds = self.meterStore.meters.map((m) => m.area.id);
      yield self.addressStore.fetchMissingAddresses(areaIds);
    }),
    deleteMeter: flow(function* (id: string) {
      yield self.meterStore.deleteMeter(id);
      self.pagination.clampToTotal(self.totalPages);
    }),
  }));

export type TRootStore = Instance<typeof RootStore>;

export const store = RootStore.create({});
