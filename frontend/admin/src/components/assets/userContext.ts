import { createContext, useState } from "react";
import { IUserContext } from "../interfaces/IUserContext";

export const userContext = createContext<IUserContext | null>(null)