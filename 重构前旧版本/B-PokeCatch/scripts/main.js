import { world, system, ItemStack, EntityHealthComponent } from "@minecraft/server";
import { entities } from "./setting";

const time = new Map();
const oldItem = new ItemStack("ed:ball");
const newItem = new ItemStack("ed:ball_1");

system.runInterval(() => {
    for (const [key, value] of time) {
        if (value > 0) {
            time.set(key, value - 1);
        }
    }
});

function toReceive(hurtEntity) {
    const block = hurtEntity.dimension.getBlock(hurtEntity.location);
    const entities = hurtEntity.dimension.getEntitiesAtBlockLocation(block.location);
    const hurtEntityKill = { x: hurtEntity.location.x - 99999, y: -64, z: hurtEntity.location.z - 99999 };
    hurtEntity.runCommandAsync(`structure save ball${hurtEntity.id} ${hurtEntity.location.x} ${hurtEntity.location.y} ${hurtEntity.location.z} ${hurtEntity.location.x} ${hurtEntity.location.y} ${hurtEntity.location.z} true disk false`).then(rt => {
        if (rt.successCount == 1) {
            for (const entity of entities) {
                if (entity.typeId != "minecraft:player") {
                    entity.teleport(hurtEntityKill, { dimension: hurtEntity.dimension });
                }
            }
        };
    })
}


world.afterEvents.projectileHitEntity.subscribe(args => {
    const projectile = args.projectile; 
    const entity = args.getEntityHit().entity;
    const { x, y, z } = entity.location;
    if (projectile.typeId != "ed:ball") return;
    const num = Math.round(Math.random() * 100);
    if (!entities.includes(entity.typeId) && entity.getComponent(EntityHealthComponent.componentId) && num <= 60) {
        const health = entity.getComponent(EntityHealthComponent.componentId);
        const json = {};
        json.id = entity.id;
        const lore = [`${`§r§fName: §9${entity.typeId}`.length > 50 ? "§r§fName: §9entity type too long" : `§r§fName: §9${entity.typeId}`}`, `§r§fHealth: §a${Math.floor(health.currentValue * 10) / 10}`];
        toReceive(entity);
        newItem.setLore(lore);
        newItem.setDynamicProperty("ball_data", JSON.stringify(json));
        entity.dimension.spawnItem(newItem, { x: x, y: y + 1, z: z });
    } else entity.dimension.spawnItem(oldItem, { x: x, y: y + 1, z: z });
});

world.afterEvents.projectileHitBlock.subscribe(args => {
    const projectile = args.projectile;
    if (projectile.typeId == "ed:ball") {
        const block = args.getBlockHit().block;
        const { x, y, z } = block.location;
        block.dimension.spawnItem(oldItem, { x: x + 0.5, y: y + 1, z: z + 0.5 });
    }
});

world.beforeEvents.itemUseOn.subscribe(args => {
    const player = args.source;
    const itemStack = args.itemStack;
    const location = args.block.location;
    if (itemStack.typeId == "ed:ball_1" && player.isSneaking) {
        system.run(() => {
            const data = itemStack.getDynamicProperty("ball_data");
            if (!time.get(player.typeId)) {
                time.set(player.typeId, 20);
                if (data) {
                    player.runCommandAsync(`structure load ball${JSON.parse(data).id} ${location.x} ${location.y + 1} ${location.z}`);
                    player.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ed:ball 1 0`);
                } else player.sendMessage({ rawtext: [{ translate: "ed.ball.error.text" }] });
            }
        })
    }
});


