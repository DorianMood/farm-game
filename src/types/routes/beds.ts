import type { SeedEnum } from "../../common/enums";

export interface BedsHarvestBody {
  index: number;
}

export interface BedsPlantBody {
  index: number;
  crop: SeedEnum;
}
