import { reloadable } from "./lib/tstl-utils";
import { modifier_panic } from "./modifiers/modifier_panic";

const heroSelectionTime = 20;

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {

    private meepo: CDOTA_BaseNPC_Hero[] | undefined;
    private changeMeepo: boolean = false;
    private endMiniGame: boolean = false;
    private currentMeepo: number = 0;
    private damage: number = 1;

    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        // Register event listeners for dota engine events
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("dota_player_used_ability", (event) => this.OnPlayerUsedAbility(event), undefined)
        ListenToGameEvent("dota_player_killed", (event) => this.OnPlayerKilled(event), undefined)
        
        // Register event listeners for events from the UI
        CustomGameEventManager.RegisterListener("ui_panel_closed", (_, data) => {
            print(`Player ${data.PlayerID} has closed their UI panel.`);

            // Respond by sending back an example event
            const player = PlayerResource.GetPlayer(data.PlayerID)!;
            CustomGameEventManager.Send_ServerToPlayer(player, "example_event", {
                myNumber: 42,
                myBoolean: true,
                myString: "Hello!",
                myArrayOfNumbers: [1.414, 2.718, 3.142]
            });

            // Also apply the panic modifier to the sending player's hero
            const hero = player.GetAssignedHero();
            //hero.AddNewModifier(hero, undefined, modifier_panic.name, { duration: 5 });

            hero.SetAbilityPoints(8);

            hero.UpgradeAbility(hero.GetAbilityByIndex(0)!);
            hero.UpgradeAbility(hero.GetAbilityByIndex(1)!);
            hero.UpgradeAbility(hero.GetAbilityByIndex(2)!);
            hero.UpgradeAbility(hero.GetAbilityByIndex(5)!);
            hero.UpgradeAbility(hero.GetAbilityByIndex(5)!);
            hero.UpgradeAbility(hero.GetAbilityByIndex(5)!);
            hero.UpgradeAbility(hero.GetAbilityByIndex(5)!);
            hero.AddItemByName("item_aghanims_shard");

           // hero.AddItemByName("item_ultimate_scepter_2");

            this.meepo = hero.GetAdditionalOwnedUnits() as CDOTA_BaseNPC_Hero[];

            this.strokeMeepo(0, 1);
        });
    }

    private strokeMeepo(meepoIndex: number, damageMultiplier: number) {
        Timers.CreateTimer(0.2, () => {
    
            if (!this.meepo || this.endMiniGame) return;

            let currentMeepo = this.meepo[meepoIndex];

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

                let prevMeepo = this.currentMeepo;

                do {
                    this.currentMeepo = Math.floor(Math.random() * this.meepo.length);
                } while (prevMeepo === this.currentMeepo);

                this.strokeMeepo(this.currentMeepo, damageMultiplier + 0.1);
                return;
            }

            return 0.01;
        });
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 1);
        GameRules.SetCustomGameSetupAutoLaunchDelay(0);
        GameRules.SetHeroSelectionTime(0);
        GameRules.SetPreGameTime(0);
        GameRules.SetShowcaseTime(0);
        GameRules.SetPostGameTime(0);
        GameRules.SetStrategyTime(0);

        let gameMode = GameRules.GetGameModeEntity();

        gameMode.SetAnnouncerDisabled(true);
        gameMode.SetKillingSpreeAnnouncerDisabled(true);
        gameMode.SetDaynightCycleDisabled(true);
        gameMode.DisableHudFlip(true);
        gameMode.SetDeathOverlayDisabled(true);
        gameMode.SetWeatherEffectsDisabled(true);

        gameMode.SetCustomGameForceHero("meepo");
        gameMode.SetFixedRespawnTime(1);

        GameRules.SetShowcaseTime(0);
        GameRules.SetHeroSelectionTime(heroSelectionTime);
    }

    public OnPlayerUsedAbility(event: DotaPlayerUsedAbilityEvent): void {

        if (!this.meepo) {
            return;
        }

        const castedMeepo = EntIndexToHScript(event.caster_entindex);
        const currentMeepo = this.meepo[this.currentMeepo];

        if (castedMeepo!.entindex() !== currentMeepo!.entindex()) {
            currentMeepo.Kill(currentMeepo.GetAbilityByIndex(3), currentMeepo);
        }

        this.changeMeepo = true;
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        if (state === GameState.CUSTOM_GAME_SETUP) {
            // Automatically skip setup in tools
            if (IsInToolsMode()) {
                Timers.CreateTimer(3, () => {
                    GameRules.FinishCustomGameSetup();
                });
            }
        }

        // Start game once pregame hits
        if (state === GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }

    private StartGame(): void {
        print("Game starting!");

        // Do some stuff here
    }

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }

    private OnPlayerKilled(event: DotaPlayerKilledEvent) {
    
        print('killed');
        this.endMiniGame = true;
    }
}
