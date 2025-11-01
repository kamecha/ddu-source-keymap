import { Item } from "jsr:@shougo/ddu-vim@11.1.0/types";
import { BaseSource, GatherArguments } from "jsr:@shougo/ddu-vim@11.1.0/source";
import { ActionData } from "../@ddu-kinds/keymap.ts";
import * as fn from "jsr:@denops/std@8.0.0/function";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  override kind = "keymap";

  override gather(
    args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        const items: Item<ActionData>[] = [];
        const keymaps = await fn.maplist(args.denops) as ActionData[];

        for (const keymap of keymaps) {
          items.push({
            word: keymap.mode + ": " + keymap.lhs +
              (keymap.noremap ? "\t-* " : "\t-> ") +
              (keymap.rhs ? keymap.rhs : "<anonymous>") +
              (keymap.desc ? "\t| " + keymap.desc : ""),
            action: keymap,
          });
        }

        controller.enqueue(items);
        controller.close();
      },
    });
  }

  override params(): Params {
    return {};
  }
}
