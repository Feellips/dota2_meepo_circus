import { BaseModifier } from "../lib/dota_ts_adapter";
import { MinigameBase } from "./minigame_base";

export class CatchAFeeder extends MinigameBase {

    private attempts: number = 0;
    private feeder: CDOTA_BaseNPC_Hero | undefined;

    constructor(id: PlayerID) {
        super(id);
    }

    start(): void {
        super.start();
        const spawn = Entities.FindByName(undefined, "spawn_loc_test");
        const origin = spawn!.GetAbsOrigin();
        this.feeder = CreateUnitByName("npc_dota_hero_pudge", origin, true, undefined, undefined, DotaTeam.GOODGUYS) as CDOTA_BaseNPC_Hero;
        this.feeder.SetModelScale(0.2);
        this.feeder.SetIdleAcquire(false);
        this.feeder.MoveToPosition((origin + RandomVector(400) as Vector));
        this.listeners.push(ListenToGameEvent("dota_player_used_ability", (event) => this.OnPlayerUsedAbility(event), undefined));
        //this.listeners.push(ListenToGameEvent(CDOTA_Modifier_Lua.OnModifierAdded, (event) => this.OnModifierEvent(event), undefined));

        this.hero.AddAbility("meepo_earthbind_ts_example");
    }
    
    stop(): void {
        super.stop();
        this.attempts = 0;
    }

    private OnPlayerUsedAbility(event: DotaPlayerUsedAbilityEvent): void {
        if (event.abilityname === 'meepo_earthbind') {
            this.attempts++;
        }
        print(this.attempts);
    }

    private OnModifierEvent(event: ModifierAddedEvent) {
        print('modifier');
    }

    getName(): string {
        return 'Catch A Feeder';
    }
}