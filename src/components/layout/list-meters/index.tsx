import styled from 'styled-components';
import { store } from '../../../stores/MeterStore';
import Table from '../../table';
import Pagination from '../../pagination';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import SkeletonList from '../../skeleton';

const Section = styled.section`
  padding: 16px;
`;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default observer(function ListMeters() {
  useEffect(() => {
    store.fetchAllData();
  }, []);

  if (store.isLoading || !store.metersWithAdresses)
    return (
      <Section>
        <Container className="container">
          <SkeletonList />
        </Container>
      </Section>
    );

  return (
    <Section>
      <Container className="container">
        <h1>Список счётчиков</h1>

        <div>
          <Table data={store.paginationMeters} />
          <Pagination />
        </div>
      </Container>
    </Section>
  );
});
