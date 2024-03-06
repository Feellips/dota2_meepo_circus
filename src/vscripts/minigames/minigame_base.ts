import { SetLevel } from "../utils/utils";

export abstract class MinigameBase {

    readonly playerId: PlayerID;
    readonly player: CDOTAPlayerController;
    readonly hero: CDOTA_BaseNPC_Hero;

    protected listeners: EventListenerID[] = [];
    protected endMiniGame: boolean = false;

    constructor(id: PlayerID) {
        print(`Preparing ${this.getName()}...`)

        this.playerId = id;
        this.player = PlayerResource.GetPlayer(this.playerId)!;
        this.hero = this.player.GetAssignedHero();
    }

    start(): void {
        print(`Starting ${this.getName()}...`);
    }

    stop(): void {
        print(`Stopping ${this.getName()}...`);
        this.listeners.forEach((listener) => StopListeningToGameEvent(listener));
        this.listeners = [];

        this.endMiniGame = true;

        SetLevel(this.hero, 1, false, false, false);
    }

    abstract getName(): string;
}