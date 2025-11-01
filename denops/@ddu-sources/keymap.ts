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
        // TODO: callback parse doesn't work yet
        const keymaps = await fn.maplist(args.denops) as ActionData[];

        // keymap to display string like `:help map-listing` function
        const mapListing = (
          mode: string,
          lhs: string,
          attr: string,
          rhs: string,
        ): string => {
          const padding = " ";
          let line = "";
          line += mode + " ".repeat(2 - mode.length) + padding;
          line += lhs + (lhs.length <= 11 ? " ".repeat(11 - lhs.length) : "") + padding;
          line += attr + " ".repeat(2 - attr.length);
          line += rhs;
          return line;
        };

        for (const keymap of keymaps) {
          // TODO: "&" の表示を調べとく
          let attr = keymap.noremap ? "*" : keymap.script ? "&" : " ";
          attr += keymap.buffer ? "@" : " ";
          items.push({
            word: mapListing(keymap.mode, keymap.lhs, attr, keymap.rhs),
            // TODO: SpecialKey でハイライトもしたい
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
