import { MinigameBase } from "./minigame_base";

export class JuggleMaster extends MinigameBase {

    private boss: CDOTA_BaseNPC_Hero | undefined;

    constructor(id: PlayerID) {
        super(id);
    }

    start(): void {
        super.start();
        const spawn = Entities.FindByName(undefined, "spawn_loc_test");
        const origin = spawn!.GetAbsOrigin();
        this.boss = CreateUnitByName("npc_dota_hero_pudge", origin, true, undefined, undefined, DotaTeam.GOODGUYS) as CDOTA_BaseNPC_Hero;
        this.boss.SetModelScale(2);
        this.boss.SetBaseDamageMin(100);
        this.boss.SetMaxHealth(100000);
        this.boss.SetHealth(100000);

        this.hero.AddAbility("meepo_earthbind_ts_example");
    }
    
    stop(): void {
        super.stop();
    }

    getName(): string {
        return 'Juggle Master';
    }
}