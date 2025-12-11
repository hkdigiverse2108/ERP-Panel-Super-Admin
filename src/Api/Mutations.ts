import { KEYS, URL_KEYS } from "../Constants";
import type { LoginPayload, LoginResponse } from "../Types";
import { Post } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),
};
