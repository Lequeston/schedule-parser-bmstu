import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export class ChatController {
  protected async send(ctx: Context<Update>, text: string, extra?: any) {
    try {
      if (ctx.updateType === 'message') {
        await ctx.reply(text, extra);
      } else {
        await ctx.answerCbQuery();
        await ctx.editMessageText(text, extra);
      }
    } catch(err) {
      console.error(err);
    }
  }

  protected parseArgs(commandStr: string): Array<string> {
    return commandStr
      .split(' ')
      .filter(value => value)
      .slice(1);
  }
}