import type { AnimalEnum } from "../../common/enums";

export interface BarnsHarvestBody {
  index: number;
}

export interface BarnsStartBody {
  index: number;
  animal: AnimalEnum;
}
