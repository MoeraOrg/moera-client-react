import { Action } from 'redux';

export interface ActionBase<T, P> extends Action<T> {
    payload?: P
}
