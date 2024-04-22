export interface OperationAdd {
  apiKey: string;
  fields: any;
  table: string;
  values: string;
  returning: string;
}

export interface OperationUpdate {
  apiKey: string;
  fields: any;
  table: string;
  condition: string;
}

export interface OperationDelete {
  apiKey: string;
  table: string;
  condition: string;
}

export interface OperationGet {
  apiKey: string;
  fields: any;
  table: string;
  condition: string;
  modifier: string;
}
