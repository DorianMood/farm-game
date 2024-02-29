import type { CropEnum } from "../../entities/bed";

export interface BedsHarvestBody {
  index: number;
}

export interface BedsPlantBody {
  index: number;
  crop: CropEnum;
}
