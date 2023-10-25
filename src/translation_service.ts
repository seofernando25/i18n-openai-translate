export type Result<Result, Error> = OkT<Result> | ErrT<Error>;
export type OkT<Result> = {
  kind: "result";
  result: Result;
};
export type ErrT<Error> = {
  kind: "failure";
  error: Error;
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

export interface Translator {
  translate(
    text: string,
    from: string,
    to: string,
    ctx: string
  ): Promise<Result<string, unknown>>;
  help(): void;
  name: string
}
