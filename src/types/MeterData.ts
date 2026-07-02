export interface RawAddress {
  id: string;
  house: { address: string };
  str_number_full: string;
  number: number;
  str_number: string;
}

export interface AreasResponse {
  results: RawAddress[];
}

export interface MeterTableData {
  id: string;
  _type: string[];
  serial_number: string;
  fullAddress: string;
  installation_date: string | null;
  is_automatic: boolean | null;
  description: string;
  initial_values: number[];
}
