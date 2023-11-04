import { Action } from 'redux';
import { ActionPattern, PutEffect, TakeEffect } from 'redux-saga/effects';
import { put, take } from 'typed-redux-saga';

export function* peek<A extends Action>(pattern?: ActionPattern<A>): Generator<PutEffect<A> | TakeEffect, A> {
    const action = yield* take(pattern);
    yield* put(action);
    return action;
}
