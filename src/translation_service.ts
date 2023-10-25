export type Result<Result, Error> = OkT<Result> | ErrT<Error>;

export type OkT<T> = {
  kind: "result";
  result: T;
};
export type ErrT<T> = {
  kind: "failure";
  error: T;
};

export function Ok<Result>(result: Result): OkT<Result> {
  return {
    kind: "result",
    result,
  };
}

export function Err<Error>(error: Error): ErrT<Error> {
  return {
    kind: "failure",
    error,
  };
}

export type TranslationResult = Result<string, Error>;
