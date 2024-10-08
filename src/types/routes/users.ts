import { UserCharacterEnum } from "../../common/enums";

export interface UsersCreateBody {
  username: string;
  email: string;
  password: string;
  city: string;
  name: string;
  character?: UserCharacterEnum;
}
