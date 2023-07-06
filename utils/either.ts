/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class Either<L, R> {
  abstract fold<B = L | R>(left: (left: L) => any, right: (right: R) => any): B;
}

export class Left<L, R> extends Either<L, R> {
  constructor(private readonly l: L) {
    super();
  }
  fold<B = L>(left: (left: L) => B, right: (right: R) => R): B {
    return left(this.l);
  }
}

export class Right<L, R> extends Either<L, R> {
  constructor(private readonly r: R) {
    super();
  }
  fold<B = R>(left: (left: L) => L, right: (right: R) => B): B {
    return right(this.r);
  }
}
