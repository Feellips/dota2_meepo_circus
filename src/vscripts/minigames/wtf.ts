import { MinigameBase } from "./minigame_base";

export class Wtf extends MinigameBase {
    getName(): string {
        return 'Wtf Game';
    }

    start(): void {
        super.start();

        this.listeners.push(ListenToGameEvent("player_chat", (event) => this.OnPlayerChat(event), undefined));
    }

    stop(): void {
        super.stop();
    }

    private OnPlayerChat(event: PlayerChatEvent) {
        if (event.text === '-wtf') {
            GameRules.SendCustomMessage('Ты че охуел?', 0, 0);
            GameRules.SendCustomMessage('-unwtf', 0, 0);
            SendToConsole('dota_ability_debug 0');
        }
        print(event.text);
    }
}