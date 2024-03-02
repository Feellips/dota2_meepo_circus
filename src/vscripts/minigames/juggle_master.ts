import { MinigameBase } from "./minigame_base";

export class JuggleMaster extends MinigameBase {

    constructor(id: PlayerID) {
        super(id);
    }

    start(): void {
        super.start();
        throw new Error("Method not implemented.");
    }
    stop(): void {
        super.stop();
        throw new Error("Method not implemented.");
    }

    getName(): string {
        return 'Juggle Master';
    }
}