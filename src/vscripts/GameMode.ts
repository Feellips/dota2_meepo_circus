import { reloadable } from "./lib/tstl-utils";
import { BeaverHunt } from "./minigames/beaver_hunt";
import { CatchAFeeder } from "./minigames/catch_a_feeder";
import { JuggleMaster } from "./minigames/juggle_master";
import { MinigameBase } from "./minigames/minigame_base";
import { modifier_panic } from "./modifiers/modifier_panic";

const heroSelectionTime = 20;

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {

    private playerId: PlayerID | undefined;

    private beaverGame: MinigameBase | undefined;
    private catchAFeederGame: MinigameBase | undefined;
    private juggleMasterGame: MinigameBase | undefined;
    private wtfGame: MinigameBase | undefined;

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
        // Register event listeners for events from the UI
        CustomGameEventManager.RegisterListener("ui_panel_closed", (_, data) => {
            this.playerId = data.PlayerID;
            const player = PlayerResource.GetPlayer(data.PlayerID)!;
            CustomGameEventManager.Send_ServerToPlayer(player, "example_event", {
                myNumber: 42,
                myBoolean: true,
                myString: "Hello!",
                myArrayOfNumbers: [1.414, 2.718, 3.142]
            });

            this.beaverGame = new BeaverHunt(data.PlayerID);
            this.catchAFeederGame = new CatchAFeeder(data.PlayerID);
            this.juggleMasterGame = new JuggleMaster(data.PlayerID);

            this.beaverGame.start();
            // this.catchAFeederGame.start();
            // this.juggleMasterGame.start();
            // this.wtfGame.start();
        });

        CustomGameEventManager.RegisterListener("on_score_changed", (_, data) => {

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
    }

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }
}
