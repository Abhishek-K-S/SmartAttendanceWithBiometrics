import { Dispatch, SetStateAction } from "react";

export interface IUserContext{
    authUser: Boolean,
    user: Object,
    setUser: Dispatch<SetStateAction<any>>
}