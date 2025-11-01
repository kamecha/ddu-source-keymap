import { DduItem } from "jsr:@shougo/ddu-vim@11.1.0/types";
import { ActionFlags, Actions } from "jsr:@shougo/ddu-vim@11.1.0/types";
import { BaseKind } from "jsr:@shougo/ddu-vim@11.1.0/kind";
import * as fn from "jsr:@denops/std@8.0.0/function";
import type { Denops } from "jsr:@denops/std@8.0.0";

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
      // TODO: For special strings, it may not work correctly, so we want to escape them properly.
      await fn.feedkeys(args.denops, action.lhs);
      return ActionFlags.None;
    },
  };

  override params(): Params {
    return {};
  }
}
