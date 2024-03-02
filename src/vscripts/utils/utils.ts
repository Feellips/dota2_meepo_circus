export function SetLevel(hero: CDOTA_BaseNPC_Hero, meepoClones: number, includeAghs: boolean, includeShard: boolean, abilitiesOn: boolean) {
    const net = hero.GetAbilityByIndex(0);
    const poof = hero.GetAbilityByIndex(1);
    const passive = hero.GetAbilityByIndex(2);
    const dig = hero.GetAbilityByIndex(3);
    const aghs = hero.GetAbilityByIndex(4);
    const ulti = hero.GetAbilityByIndex(5);
    const clones = hero.GetAdditionalOwnedUnits() as CDOTA_BaseNPC_Hero[];

    net?.SetLevel(0);
    poof?.SetLevel(0);
    passive?.SetLevel(0);
    dig?.SetLevel(0);
    aghs?.SetLevel(0);

    if (abilitiesOn) {
        for (let i = 0; i < 4; i++) {
            net?.UpgradeAbility(true)
            poof?.UpgradeAbility(true);
            passive?.UpgradeAbility(true);
        }
    }

    for (let i = 1; i < clones.length; i++) {
        clones[i].Destroy();
    }

    ulti?.SetLevel(0);
    for (let i = 0; i < meepoClones - 1; i++) {
        hero.UpgradeAbility(ulti!);
    }

    if (includeShard) {
        if (!hero.HasModifier("modifier_item_aghanims_shard")) {
            hero.AddItemByName("item_aghanims_shard");
        }
        dig?.SetLevel(1);
    }

    if (includeAghs) {
        if (!hero.HasScepter()) {
            hero.AddItemByName("item_ultimate_scepter_2");
        }
        aghs?.SetLevel(1);
    }

    net?.EndCooldown();
    poof?.EndCooldown();
    passive?.EndCooldown();
    dig?.EndCooldown();
    aghs?.EndCooldown();

    hero.SetAbilityPoints(0);
}