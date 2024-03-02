import { MinigameBase } from "./minigame_base";

export class CatchAFeeder extends MinigameBase {

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
        return 'Catch A Feeder';
    }
}