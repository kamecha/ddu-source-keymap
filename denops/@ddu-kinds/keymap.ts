import { DduItem } from "jsr:@shougo/ddu-vim@11.1.0/types";
import { ActionFlags, Actions } from "jsr:@shougo/ddu-vim@11.1.0/types";
import { BaseKind } from "jsr:@shougo/ddu-vim@11.1.0/kind";
import * as fn from "jsr:@denops/std@8.0.0/function";
import type { Denops } from "jsr:@denops/std@8.0.0";
import type { RawString } from "jsr:@denops/std@8.0.0/eval";
import { rawString, useEval } from "jsr:@denops/std@8.0.0/eval";

type Params = Record<never, never>;

// :help mapping-dict
export type ActionData = {
  lhs: string;
  lhsraw: Uint8Array;
  lhsrawalt?: Uint8Array;
  rhs: string;
  silent: 0 | 1;
  noremap: 0 | 1;
  script: 0 | 1;
  expr: 0 | 1;
  buffer: 0 | 1;
  mode: string;
  sid: number;
  scriptversion: number;
  lnum: number;
  nowait: 0 | 1;
  abbr: 0 | 1;
  mode_bits: number;

  // neovim only? not documented in :help mapping-dict
  desc?: string;
  callback?: string;
};

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    type: async (args: {
      denops: Denops;
      items: DduItem[];
    }) => {
      const action = args.items[0].action as ActionData;
      if (action.mode !== "n") {
        return ActionFlags.None;
      }
      // "<CR>" -> "\<CR>"
      const escapedLhs = action.lhs.replace(/<([^>]+)>/g, "\\<$1>");
      // vim 上での "\<CR>" の扱いをするため、 RawString に変換する
      const lhsKeySequence: RawString = rawString`${escapedLhs}`;
      await useEval(args.denops, async (denopsHelper) => {
        await fn.feedkeys(denopsHelper, lhsKeySequence);
      });
      return ActionFlags.None;
    },
  };

  override params(): Params {
    return {};
  }
}
