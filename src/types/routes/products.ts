export interface ProductsPurchaseBody {
  id: string;
}

export interface ProductsSellBody {
  id: string;
  amount: number;
}

export enum RetrieveProductsFilterEnum {
  all = "all",
  mine = "mine",
  available = "available",
}

export interface RetrieveProductsQuery {
  filter?: RetrieveProductsFilterEnum;
}
