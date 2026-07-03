import { types } from 'mobx-state-tree';

const PAGE_SIZE = 20;
const DELTA = 1;

export const PaginationStore = types
  .model('PaginationStore', {
    currentPage: types.optional(types.number, 1),
  })
  .volatile(() => ({
    pageSize: PAGE_SIZE,
  }))
  .actions((self) => ({
    setPage(page: number) {
      self.currentPage = page;
    },
    clampToTotal(total: number) {
      if (self.currentPage > total) self.currentPage = Math.max(1, total);
    },
  }))
  .views((self) => ({
    getTotalPages(itemsCount: number) {
      return Math.ceil(itemsCount / self.pageSize) || 1;
    },
    getPageSlice<T>(items: T[]) {
      const start = (self.currentPage - 1) * self.pageSize;
      return items.slice(start, start + self.pageSize);
    },
    getPageNumbers(total: number): (number | '...')[] {
      const current = self.currentPage;

      if (total <= 6) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      const left = Math.max(2, current - DELTA);
      const right = Math.min(total - 1, current + DELTA);

      const result: (number | '...')[] = [1];
      if (left > 2) result.push('...');
      for (let i = left; i <= right; i++) result.push(i);
      if (right < total - 1) result.push('...');
      result.push(total);

      return result;
    },
  }));
