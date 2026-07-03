import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { store } from '../../stores/RootStore';

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--grey-30);
  border-radius: 0 0 12px 12px;
`;

const Button = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--grey-30);
  border-radius: 6px;
  color: var(--dark-60);
  background: ${(props) =>
    props.$active ? 'var(--grey-25)' : 'var(--absolute-white)'};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:active {
    background-color: var(--grey-25);
  }
`;

const Dots = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--dark-60);
`;

const Pagination = observer(() => {
  return (
    <PaginationWrapper>
      {store.pageNumbers.map((page, index) =>
        page === '...' ? (
          <Dots key={`dots-${index}`}>...</Dots>
        ) : (
          <Button
            key={page}
            $active={page === store.pagination.currentPage}
            onClick={() => store.pagination.setPage(page)}
          >
            {page}
          </Button>
        )
      )}
    </PaginationWrapper>
  );
});

export default Pagination;
