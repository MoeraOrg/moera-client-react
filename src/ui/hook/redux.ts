import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

import { ClientAction } from "state/action";

export const useDispatcher = useDispatch<Dispatch<ClientAction>>;
