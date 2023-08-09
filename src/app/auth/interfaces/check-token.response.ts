import { User } from "./user.interface";

export interface CheckToekenResponse {
    user: User,
    token: string
}
