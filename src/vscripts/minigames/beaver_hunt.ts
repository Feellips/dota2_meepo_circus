import { SetLevel } from "../utils/utils";

export class BeaverHunt {

    private meepoClones: CDOTA_BaseNPC_Hero[] | undefined;
    private changeMeepo: boolean = false;
    private endMiniGame: boolean = false;
    private currentMeepoIndex: number = 0;
    private listeners: EventListenerID[] = [];

    private readonly playerId: PlayerID;
    private readonly damage: number = 1;
    private readonly player: CDOTAPlayerController;
    private readonly hero: CDOTA_BaseNPC_Hero;
    
    constructor(id: PlayerID) {
        print('Preparing Beaver Hunt...')

        this.playerId = id;
        this.player = PlayerResource.GetPlayer(this.playerId)!;
        this.hero = this.player.GetAssignedHero();
    }

    public start() {
        print('Beaver Hunt starting!')
      
        SetLevel(this.hero, 4, false, true, false);

        this.meepoClones = this.hero.GetAdditionalOwnedUnits() as CDOTA_BaseNPC_Hero[];
        this.listeners.push(ListenToGameEvent("dota_player_used_ability", (event) => this.OnPlayerUsedAbility(event), undefined));
        this.listeners.push(ListenToGameEvent("dota_player_killed", (event) => this.OnPlayerKilled(event), undefined));

        this.strokeMeepo(0, 1);
    }

    public stop() {
        this.endMiniGame = true;
        this.listeners.forEach((listener) => StopListeningToGameEvent(listener));
        this.listeners = [];

        SetLevel(this.hero, 1, false, false, false);
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
                    this.currentMeepoIndex = Math.floor(Math.random() * (this.meepoClones.length - 1));
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
        }
    }

    private OnPlayerKilled(_: DotaPlayerKilledEvent) {
        this.stop();
    }
}