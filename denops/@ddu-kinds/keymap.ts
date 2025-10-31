import { BaseKind } from "jsr:@shougo/ddu-vim@11.1.0/kind";

type Params = Record<never, never>;

export type ActionData = Record<never, never>;

export class Kind extends BaseKind<Params> {
  override actions = {};

  override params(): Params {
    throw new Error("Method not implemented.");
  }
}
