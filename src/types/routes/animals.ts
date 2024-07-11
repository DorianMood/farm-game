import type { PetEnum } from "../../common/enums";

export interface AnimalsHarvestBody {
  index: number;
}

export interface AnimalsStartBody {
  index: number;
  animal: PetEnum;
}
