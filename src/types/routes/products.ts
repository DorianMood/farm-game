export interface ProductsPurchaseBody {
  id: string;
}

export enum RetrieveProductsFilterEnum {
  all = "all",
  mine = "mine",
  available = "available",
}

export interface RetrieveProductsQuery {
  filter?: RetrieveProductsFilterEnum;
}
