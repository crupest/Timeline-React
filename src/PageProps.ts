import { UserWithToken } from "./services/user";

export interface PageProps {
  user: UserWithToken | null;
}
