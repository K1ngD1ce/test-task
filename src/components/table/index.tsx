import styled from 'styled-components';

import { useState } from 'react';
import type { MeterTableData } from '../../types/MeterData';
import {
  // FlameIcon,
  HotWaterIcon,
  ColdWaterIcon,
  BasketIcon,
  // LightningIcon,
} from '../../../public/icons/index';
import { store } from '../../stores/RootStore';
import { observer } from 'mobx-react-lite';
import formattedDate from '../../utils/formatDate';
interface Props {
  data: MeterTableData[];
}

const Table = observer(({ data }: Props) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const setTypeMeter = (type: string[]) => {
    if (type[0] === 'HotWaterAreaMeter') {
      return (
        <StyledIcon>
          <HotWaterIcon /> ГВС
        </StyledIcon>
      );
    }
    if (type[0] === 'ColdWaterAreaMeter') {
      return (
        <StyledIcon>
          <ColdWaterIcon /> ХВС
        </StyledIcon>
      );
    }
    return null;
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await store.deleteMeter(id);
    setDeletingId(null);
  };

  return (
    <TableOuter>
      <TableWrapper>
        <THead>
          <tr>
            <Th>№</Th>
            <Th>Тип</Th>
            <Th>Дата установки</Th>
            <Th>Автоматический</Th>
            <Th>Текущие показания</Th>
            <Th>Адрес</Th>
            <Th>Примечание</Th>
            <Th></Th>
          </tr>
        </THead>
        <tbody>
          {data.map((meter, index) => {
            return (
              <Tr key={meter.id}>
                <Td className="number">{index + 1}</Td>
                <Td>{setTypeMeter(meter._type)}</Td>
                <Td>
                  {meter.installation_date
                    ? `${formattedDate(meter.installation_date)}`
                    : '--.--.----'}
                </Td>
                <Td>
                  {meter.is_automatic === true
                    ? 'да'
                    : meter.is_automatic === false
                      ? 'нет'
                      : 'не указано'}
                </Td>
                <Td>{meter.initial_values?.[0] ?? '-'}</Td>
                <Td>{meter.fullAddress}</Td>
                <Td>{meter.description || '-'}</Td>
                <LastTd>
                  <DeleteBtn
                    disabled={deletingId === meter.id}
                    onClick={() => handleDelete(meter.id)}
                  >
                    <BasketIcon />
                  </DeleteBtn>
                </LastTd>
              </Tr>
            );
          })}
        </tbody>
      </TableWrapper>
    </TableOuter>
  );
});

export default Table;
const TableOuter = styled.div`
  border: 1px solid var(--grey-30);
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  max-height: 860px;
  overflow-y: auto;
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: var(--grey-20);
  z-index: 1;
`;

const Th = styled.th`
  width: auto;
  font-weight: 500;
  font-size: 13px;
  line-height: 123%;
  padding: 8px 12px;
  color: var(--grey-50);
  text-align: left;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--red-20);
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;

  svg {
    width: 16px;
    height: 16px;

    path {
      transition: fill 0.3s ease-in-out;
      fill: var(--red-50);
    }
  }

  &:hover {
    svg {
      path {
        fill: var(--red-60);
      }
    }
  }

  &:disabled {
    background-color: var(--grey-25);

    svg {
      path {
        fill: var(--grey-40);
      }
    }
  }
`;

const Tr = styled.tr`
  position: relative;
  height: 52px;
  border-bottom: 1px solid var(--grey-30);
  transition: background-color 0.3s ease-in-out;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--grey-25);
  }

  &:hover ${DeleteBtn} {
    opacity: 1;
    pointer-events: auto;
  }
`;

const Td = styled.td`
  width: auto;
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  padding: 10px 12px;
  color: var(--dark-50);
  text-align: left;

  &.number {
    color: var(--grey-60);
  }
`;

const LastTd = styled(Td)`
  position: relative;
  padding: 0;
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 10px;
    height: 14px;
  }
`;
