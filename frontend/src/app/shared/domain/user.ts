import { Address } from "./address";

export interface User{
  id: number,
  username:  string,
  password?: string,
  email: string,
  hasCompletedOnboarding?: boolean,
  addresses?: Address[],


}
