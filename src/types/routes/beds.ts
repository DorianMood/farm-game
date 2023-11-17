import { CropEnum } from 'src/entities/bed';

export interface BedsHarvestBody {
  index: number;
}

export interface BedsPlantBody {
  index: number;
  crop: CropEnum;
}
