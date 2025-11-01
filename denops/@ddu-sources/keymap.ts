import { Item, ItemHighlight } from "jsr:@shougo/ddu-vim@11.1.0/types";
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
        ): [string, ItemHighlight[]] => {
          const padding = " ";
          let line = "";
          const angleBracketPattern = /<[^>]+>/g;
          let match: RegExpExecArray | null;
          let offset = 0;
          const highlights: ItemHighlight[] = [];

          line += mode + " ".repeat(2 - mode.length) + padding;

          offset = line.length;
          // lhs から <...> 部分を探して、それぞれの位置情報から highlights を更新する
          while ((match = angleBracketPattern.exec(lhs)) !== null) {
            highlights.push({
              name: "ddu-keymap-angle-bracket",
              hl_group: "SpecialKey",
              col: offset + match.index + 1,
              width: match[0].length,
            });
          }
          line += lhs + (lhs.length <= 11 ? " ".repeat(11 - lhs.length) : "") +
            padding;

          // * の箇所だけ highliths を更新
          offset = line.length;
          if (attr[0] === "*") {
            highlights.push({
              name: "ddu-keymap-noremap",
              hl_group: "SpecialKey",
              col: offset + 1,
              width: 1,
            });
          }
          line += attr + " ".repeat(2 - attr.length);

          offset = line.length;
          // rhs から <...> 部分を探して、それぞれの位置情報から highlights を更新する
          while ((match = angleBracketPattern.exec(rhs)) !== null) {
            highlights.push({
              name: "ddu-keymap-angle-bracket",
              hl_group: "SpecialKey",
              col: offset + match.index + 1,
              width: match[0].length,
            });
          }
          line += rhs;

          return [line, highlights];
        };

        for (const keymap of keymaps) {
          // TODO: "&" の表示を調べとく
          let attr = keymap.noremap ? "*" : keymap.script ? "&" : " ";
          attr += keymap.buffer ? "@" : " ";

          const [word, highlights] = mapListing(
            keymap.mode,
            keymap.lhs,
            attr,
            keymap.rhs,
          );

          items.push({
            word: word,
            highlights: highlights,
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
