/**
 * Created by AsafShifer on 18/02/2017.
 */
'use strict';
const isFunction = input => typeof input === 'function';
export default bDoShow => elemOrThunk =>
    bDoShow ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;