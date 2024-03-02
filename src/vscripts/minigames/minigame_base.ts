export abstract class MinigameBase {

    readonly playerId: PlayerID;
    readonly player: CDOTAPlayerController;
    readonly hero: CDOTA_BaseNPC_Hero;

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
    }

    abstract getName(): string;
}