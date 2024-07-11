import type { CropEnum } from "../../common/enums";

export interface BedsHarvestBody {
  index: number;
}

export interface BedsPlantBody {
  index: number;
  crop: CropEnum;
}
