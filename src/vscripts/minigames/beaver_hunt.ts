import { SetLevel } from "../utils/utils";
import { MinigameBase } from "./minigame_base";

export class BeaverHunt extends MinigameBase {

    private meepoClones: CDOTA_BaseNPC_Hero[] | undefined;
    private changeMeepo: boolean = false;
    private currentMeepoIndex: number = 0;
    private score: number = 0;

    private readonly damage: number = 1;
    
    constructor(id: PlayerID) {
        super(id);
    }

    public start() {
        super.start();
      
        SetLevel(this.hero, 4, false, true, false);

        this.meepoClones = this.hero.GetAdditionalOwnedUnits() as CDOTA_BaseNPC_Hero[];
        this.listeners.push(ListenToGameEvent("dota_player_used_ability", (event) => this.OnPlayerUsedAbility(event), undefined));
        this.listeners.push(ListenToGameEvent("dota_player_killed", (event) => this.OnPlayerKilled(event), undefined));

        this.strokeMeepo(0, 1);
    }

    public stop() {
        super.stop();
    }

    public getName(): string {
        return 'Beaver Hunt';
    }

    private strokeMeepo(meepoIndex: number, damageMultiplier: number) {
        Timers.CreateTimer(0.2, () => {
    
            if (!this.meepoClones || this.endMiniGame) return;

            let currentMeepo = this.meepoClones[meepoIndex];

            const finalDamage = this.damage * damageMultiplier;

            const damage = CreateDamageInfo(currentMeepo, currentMeepo, Vector(0.0, 0.0, 0.0), Vector(0.0, 0.0, 0.0), finalDamage, 0);
            currentMeepo.TakeDamage(damage);
            DestroyDamageInfo(damage);

            if (this.changeMeepo) {
                this.changeMeepo = false;

                currentMeepo.SetHealth(currentMeepo.GetMaxHealth());
                currentMeepo.SetMana(currentMeepo.GetMaxMana());

                let digAbility = currentMeepo.GetAbilityByIndex(3);
                digAbility?.EndCooldown();

                let prevMeepo = this.currentMeepoIndex;

                do {
                    this.currentMeepoIndex = Math.floor(Math.random() * (this.meepoClones.length));
                } while (prevMeepo === this.currentMeepoIndex);

                this.strokeMeepo(this.currentMeepoIndex, damageMultiplier + 0.1);
                return;
            }

            return 0.01;
        });
    }

    private OnPlayerUsedAbility(event: DotaPlayerUsedAbilityEvent): void {

        if (!this.meepoClones || this.endMiniGame) {
            return;
        }

        const castedMeepo = EntIndexToHScript(event.caster_entindex);
        const currentMeepo = this.meepoClones[this.currentMeepoIndex];

        if (castedMeepo!.entindex() !== currentMeepo!.entindex() || event.abilityname !== 'meepo_petrify') {
            currentMeepo.Kill(currentMeepo.GetAbilityByIndex(3), currentMeepo);
        } else {
            this.changeMeepo = true;
            CustomGameEventManager.Send_ServerToPlayer(this.player, "on_score_changed", { score: ++this.score });
        }
    }

    private OnPlayerKilled(_: DotaPlayerKilledEvent) {
        this.stop();
    }
}