import { AuthContextData } from '../navigations/authContext';
import { ActionType } from './ActionType';

interface LoginAction {
    type: ActionType.LOGIN;
    payload: AuthContextData;
}

interface LogoutAction {
    type: ActionType.LOGOUT;
}

export type Action =
    | LoginAction
    | LogoutAction