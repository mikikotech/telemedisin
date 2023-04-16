import { AuthContextData } from "../navigations/authContext";
import { Action } from "./Action";
import { ActionType } from "./ActionType";

interface ReducerProps {
    auth: AuthContextData;
}

const initialState = {
    auth: {
        nama: "",
        email: "",
        role: ""
    }
};

const reducer = (state: ReducerProps = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.LOGIN:
            return {
                auth: action.payload
            }
        case ActionType.LOGOUT:
            return {
                auth: {
                    nama: "",
                    email: "",
                    role: ""
                }
            }
        default:
            return {
                ...state,
            }
    }
}

export type ReducerRootState = ReturnType<typeof reducer>;

export default reducer;