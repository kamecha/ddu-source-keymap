import { Item } from "jsr:@shougo/ddu-vim@11.1.0/types";
import { BaseSource } from "jsr:@shougo/ddu-vim@11.1.0/source";
import { ActionData } from "../@ddu-kinds/keymap.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  override kind = "keymap";

  override gather(): ReadableStream<Item<ActionData>[]> {
    throw new Error("Not implemented");
  }

  override params(): Params {
    throw new Error("Not implemented");
  }
}
