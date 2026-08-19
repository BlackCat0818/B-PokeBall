// LiteLoader-AIDS automatic generated
/// <reference path="c:\LSE-API/dts/helperlib/src/index.d.ts"/> 


const PLUGIN_NAME = "B-PokeCatch";
const PLUGIN_VERSION = [0, 5, 7, Version.Beta];

ll.registerPlugin(
    PLUGIN_NAME,
    `精灵球插件——捕捉生物&释放生物`,
    PLUGIN_VERSION,
    { "作者qq": "3096514973" }
);

const { I18nAPI, Minecraft } = require('./GMLIB-LegacyRemoteCallApi/lib/GMLIB_API-JS'); // 翻译实体名称用的

Minecraft.setFixI18nEnabled();

const plugin_name = `B-PokeCatch`;
const plugin_prefix = `§a§l[Poke] §r`;

const plugin_data = new JsonConfigFile(`./plugins/${plugin_name}/data/pokeCatch.json`, JSON.stringify(
    {
        "playerCatch": {},
        "dispenserCatch": []
    }
    , null, 4)
);

const entityTyeName = new JsonConfigFile(`./plugins/${plugin_name}/data/entityTypeName.json`, JSON.stringify(
    {
        "minecraft:pig": "猪",
        "minecraft:cow": "牛",
        "minecraft:mooshroom": "哞菇",
        "minecraft:allay": "悦灵",
        "minecraft:sheep": "绵羊",
        "minecraft:camel": "骆驼",
        "minecraft:creeper": "苦力怕",
        "minecraft:chicken": "鸡",
        "minecraft:turtle": "海龟",
        "minecraft:wolf": "狼",
        "minecraft:villager": "旧版村民",
        "minecraft:villager_v2": "新版村民",
        "minecraft:zombie_villager": "旧版僵尸村民",
        "minecraft:zombie_villager_v2": "新版僵尸村民",
        "minecraft:panda": "熊猫",
        "minecraft:parrot": "鹦鹉",
        "minecraft:shulker": "潜影贝",
        "minecraft:horse": "马",
        "minecraft:mule": "猪",
        "minecraft:cat": "猫",
        "minecraft:ocelot": "豹猫",
        "minecraft:iron_golem": "铁傀儡",
        "minecraft:axolotl": "美西螈",
        "minecraft:sniffer": "嗅探兽",
        "minecraft:snow_golem": "雪傀儡",
        "minecraft:strider": "炽足兽",
        "minecraft:frog": "青蛙",
        "minecraft:bee": "蜜蜂",
        "minecraft:dolphin": "海豚",
        "minecraft:fox": "狐狸",
        "minecraft:llama": "羊驼",
        "minecraft:polar_bear": "北极熊",
        "minecraft:piglin": "猪灵",
        "minecraft:drowned": "溺尸",
        "minecraft:armadillo": "犰狳"
    }, null, 4
));

const plugin_config = new JsonConfigFile(`./plugins/${plugin_name}/config/config.json`, JSON.stringify(
    {
        "pokeBallName": "§d§l大师球§r", // 精灵球的名称
        "capturableCreatures": [ // 允许被捕捉的生物列表
            "minecraft:pig",
            "minecraft:cow",
            "minecraft:sheep",
            "minecraft:creeper",
            "minecraft:chicken",
            "minecraft:wolf",
            "minecraft:villager",
            "minecraft:villager_v2",
            "minecraft:zombie_villager",
            "minecraft:zombie_villager_v2", ,
            "minecraft:panda",
            "minecraft:parrot",
            "minecraft:shulker",
            "minecraft:piglin",
            "minecraft:horse",
            "minecraft:mule",
            "minecraft:cat",
            "minecraft:ocelot"
        ],
        "playerNormalSuccessPercent": 0.65, // 玩家正常情况下捕捉成功的概率（百分比）
        "dispenserNormalSuccessPercent": 0.65, // 发射器正常情况下捕捉成功的概率（百分比）
        "damageRate": 0.70, // 捕捉失败时精灵球有一定概率消失（百分比）
        "entityIsAngrySuccessPercent": 0.25, // 生物生气时捕捉成功的概率
        "consumeItem": false, // 捕捉成功/失败后是否消耗精灵球物品（不可重复利用）
        "autoReturnItem": true, // 当捕捉生物后（无论是否捕捉成功）是否自动给予物品到玩家手中，如果为false，则生成精灵球掉落物
        "autoReturnItemWhenTargetEmpty": true, // 当弹射物命中的目标为空时自动返回物品
        "judgeEntityHealthPercent": { // 是否判断生物血量
            "enable": false,
            "successHealthPercent": 0.9 // 当生物的血量小于此生物的血量的百分之90时才会被捕捉
        },
        "globalLandJudge": false, // 是否判断领地（目前仅兼容iland和PLand）
        "releaseEntityNeedsLandPerm": true, // 在他人领地内释放生物是否需要领地权限
        "releaseEntityIsNeedPlayerIsSneaking": true, // 释放生物时是否需要玩家潜行
        "judgeEntityCustomName": true, // 是否判断生物自定义名称（如果生物被重命名则无法被捕捉）
        "judgeEntityIsSleeping": true, // 是否判断生物正在睡觉（如果生物正在睡觉则无法被捕捉）
        "judgeEntityIsTrading": true, // 是否判断生物正在交易中（如果生物正在交易中则无法被捕捉）
        "judgePlayerGameModeIsSurvival": true, // 是否判断玩家模式（如果玩家不是生存模式则无法捕捉生物）
        "judgePlayerIsSneaking": false, // 捕捉生物时是否需要玩家潜行
        "judgeEntityIsTamedByPlayer": false // 玩家仅可捕捉信任玩家的生物
    }
    , null, 4)
);

const playerNormalSuccessPercent = plugin_config.get("playerNormalSuccessPercent");
const dispenserNormalSuccessPercent = plugin_config.get("dispenserNormalSuccessPercent");
const damageRate = plugin_config.get("damageRate");
const entityIsAngrySuccessPercent = plugin_config.get("entityIsAngrySuccessPercent");
const consumeItem = plugin_config.get("consumeItem");
const autoReturnItem = plugin_config.get("autoReturnItem");
const autoReturnItemWhenTargetEmpty = plugin_config.get("autoReturnItemWhenTargetEmpty");
const judgeEntityHealthPercent = plugin_config.get("judgeEntityHealthPercent")["enable"];
const successHealthPercent = plugin_config.get("judgeEntityHealthPercent")["successHealthPercent"];
const globalLandJudge = plugin_config.get("globalLandJudge");
const releaseEntityNeedsLandPerm = plugin_config.get("releaseEntityNeedsLandPerm");
const releaseEntityIsNeedPlayerIsSneaking = plugin_config.get("releaseEntityIsNeedPlayerIsSneaking");
const judgeEntityCustomName = plugin_config.get("judgeEntityCustomName");
const judgeEntityIsSleeping = plugin_config.get("judgeEntityIsSleeping");
const judgeEntityIsTrading = plugin_config.get("judgeEntityIsTrading");
const judgePlayerGameModeIsSurvival = plugin_config.get("judgePlayerGameModeIsSurvival");
const judgePlayerIsSneaking = plugin_config.get("judgePlayerIsSneaking");
const judgeEntityIsTamedByPlayer = plugin_config.get("judgeEntityIsTamedByPlayer");

const normalItem = "ed:ball_1";
const projectileItem = "ed:ball";

/**
 * 判断玩家所在坐标是否有权限
 * @param {Player} Player 玩家对象
 * @param {IntPos} Pos 方块的坐标对象
 */
function LandJudgmentByPlayer(Player, Pos) {
    if (!globalLandJudge) return true;

    // iLand
    /**
     * 
     * @param {IntPos} Pos 
     * @returns 
     */
    const toRawPos = (Pos) => ({
        'x': Pos.x,
        'y': Pos.y,
        'z': Pos.z,
        'dimid': Pos.dimid
    });
    if (ll.hasExported('ILAPI_PosGetLand')) {
        /** 领地ID @type {Number} */
        let LandId = ll.imports('ILAPI_PosGetLand')(toRawPos(Pos));
        if (LandId != -1 &&
            !(
                ll.imports('ILAPI_IsLandOwner')(LandId, Player.xuid)// 领地主人
                || ll.imports('ILAPI_IsLandOperator')(Player.xuid)// 领地管理
                || ll.imports('ILAPI_IsPlayerTrusted')(LandId, Player.xuid)// 被信任的
            )
        ) return false;
    }

    // PLand 
    if (ll.hasExported('PLand_LDAPI', 'PLand_getLandAt') && ll.hasExported('PLand_LDAPI', 'PLand_getPermType')) {
        let LandId = ll.imports("PLand_LDAPI", "PLand_getLandAt")(Pos);
        let LandPermType = ll.imports("PLand_LDAPI", "PLand_getPermType")(Player.uuid, LandId, false);
        // 如果在领地内并且玩家是访客（玩家在无权限的领地内）
        if (LandId != -1 && LandPermType == 3) return false;
        /*
            LandPermType:
            Operator = 0,// 领地操作员（管理）
            Owner = 1,// 领地主人
            Member = 2,// 领地成员（被领地主人加入信任名单的人）
            Guest = 3 // 访客（无权限者）
            
        */
    }
    return true;
}


/**
 * 判断某个坐标是否在领地内
 * @param {IntPos} Pos 
 */
function LandJudgmentByDispenser(Pos) {
    if (!globalLandJudge) return true;
    /**
     * 
     * @param {IntPos} Pos 
     * @returns 
     */
    const toRawPos = (Pos) => ({
        'x': Pos.x,
        'y': Pos.y,
        'z': Pos.z,
        'dimid': Pos.dimid
    });

    // iLand
    if (ll.hasExported('ILAPI_PosGetLand')) {
        /** 领地ID @type {Number} */
        let LandId = ll.imports('ILAPI_PosGetLand')(toRawPos(Pos));
        if (LandId != -1) return false;
    }

    // PLand
    if (ll.hasExported("PLand_LDAPI", "PLand_getLandAt")) {
        /** 领地ID @type {Number} */
        let LandId = ll.imports('PLand_LDAPI', "PLand_getLandAt")(Pos);
        if (LandId != -1) return false;
    }
    return true;
}

mc.listen("onServerStarted", () => {
    const poke_cmd = mc.newCommand(`poke`, `查询可捕捉的生物列表`, PermType.Any);
    poke_cmd.overload([]);
    poke_cmd.setCallback((cmd, ori, out, res) => {
        let player = ori.player;
        const /**@type {Array<string>}*/list = plugin_config.get("capturableCreatures");
        let newlist = [];
        let originalCount = 0;
        let addonCount = 0;
        for (const i of list) {
            if (!entityTyeName.get(i)) {
                entityTyeName.set(i, i);
            }
            if (i.split(":")[0] === "minecraft") {

                newlist.push(`§a原版：§e${entityTyeName.get(i)}`);
                originalCount += 1;
            } else {
                newlist.push(`§dAddOn：§b${entityTyeName.get(i)}`);
                addonCount += 1;
            }
        }
        entityTyeName.reload();
        //I18nAPI.get(entity.getTranslateKey(), [], "zh_CN");
        if (!player) {
            return out.success(`精灵球-可捕捉的生物列表\n总数：${newlist.length}，包含原版生物 ${originalCount} 个，AddOn生物 ${addonCount} 个\n${newlist.join("\n")}`);
        }
        let form = mc.newCustomForm();
        form.setTitle(`精灵球-可捕捉的生物列表`);
        form.addLabel(`总数：${newlist.length}，包含原版生物 ${originalCount} 个，AddOn生物 ${addonCount} 个\n${newlist.join("\n")}`);
        player.sendForm(form, (pl, id) => {
            if (id == null) {
                return;
            }
        })

    });
    poke_cmd.setup();
});


/**
 * 
 * @param {Array.<number>} coordinates 
 * @param {number} side 
 * @returns 
 */
function getOffsetCoordinates(coordinates, side) {
    let [x, y, z] = coordinates;

    switch (side) {
        case 0: // 下
            y -= 2;
            break;
        case 1: // 上
            y += 1;
            break;
        case 2: // 北
            z -= 1;
            break;
        case 3: // 南
            z += 1;
            break;
        case 4: // 西
            x -= 1;
            break;
        case 5: // 东
            x += 1;
            break;
        default:
            throw new Error("Invalid side value. Must be between 0 and 5.");
    }

    return [x, y, z];
}
const filterList = [
    "minecraft:furnace",
    "minecraft:lit_furnace",
    "minecraft:brewing_stand",
    "minecraft:hopper",
    "minecraft:blast_furnace",
    "minecraft:lit_blast_furnace",
    "minecraft:smoker",
    "minecraft:lit_smoker",
    "minecraft:anvil",
    "minecraft:stonecutter_block",
    "minecraft:loom",
    "minecraft:cartography_table",
    "minecraft:crafting_table",
    "minecraft:smithing_table",
    "minecraft:grindstone",
    "minecraft:beacon",
    "minecraft:enchanting_table",
    "minecraft:ender_chest",
    "minecraft:command_block",
    "minecraft:chain_command_block",
    "minecraft:repeating_command_block",
    "minecraft:structure_block",
    "minecraft:jigsaw"
];

let lastTriggerTime = 0;
const debounceTime = 200; // 防抖时间间隔，单位为毫秒（推荐50~100）

mc.listen("onUseItemOn", (player, item, block, side) => {
    if (item.isNull() || item.type !== normalItem || item.lore.length < 9 || filterList.includes(item.type)
        || block.hasContainer() || block.isButtonBlock || block.isDoorBlock || block.isThinFenceBlock || block.isFenceGateBlock || block.isFenceBlock
        || block.type.endsWith("_trapdoor")
    ) {
        //logger.warn(`onUseItemOn 323 返回`);
        return;
    };

    const currentTime = Date.now();
    if (currentTime - lastTriggerTime < debounceTime) {
        //logger.warn(`onUseItemOn 329 返回`);
        return;
    };
    lastTriggerTime = currentTime;

    const clonedItem = item.clone();
    const lore = clonedItem.lore;
    const [entityUniqueId, type, entityName, entityHealth] = lore.slice(0, 4).map(line => line.replace(/§[a-zA-Z0-9]/g, ''));
    const entityType = type.split("：")[1];
    const entityData = JSON.parse(File.readFrom(`./plugins/${plugin_name}/data/pokeCatch.json`));
    const playerUUID = player.uuid;

    const releaseChecks = () => {
        if (releaseEntityIsNeedPlayerIsSneaking && !player.isSneaking) {
            player.tell(`${plugin_prefix}§c只有当您潜行时才能释放生物!`);
            //logger.warn(`onUseItemOn 344 返回`);
            return false;
        }
        if (releaseEntityNeedsLandPerm && !LandJudgmentByPlayer(player, player.blockPos)) {
            player.tell(`${plugin_prefix}§c禁止在他人领地内释放生物!`);
            //logger.warn(`onUseItemOn 349 返回`);
            return false;
        }
        return true;
    };

    const spawnEntity = (data, ownerUUID = playerUUID) => {
        if (!releaseChecks()) {
            //logger.warn(`onUseItemOn 357 返回`);
            return;
        };

        const [x, y, z] = getOffsetCoordinates([block.pos.x, block.pos.y, block.pos.z], side);
        const spawnPos = new FloatPos(x + 0.5, y, z + 0.5, block.pos.dimid);

        if (!spawnEntityWithSNBT(data["capturedEntityTypeName"], spawnPos, data["capturedEntityTypeSNBT"])) {
            player.tell(`${plugin_prefix}释放失败：${entityName}，${entityHealth} §f请联系腐竹或服务器管理员!`);
            logger.error(`entityUniqueId 为 ${entityUniqueId} 的生物释放失败：${entityName}，${entityHealth} 请查看控制台和数据文件!`);
            return;
        }

        if (removeEntityData(entityType, ownerUUID, entityUniqueId)) {
            player.tell(`${plugin_prefix}成功释放：${entityName}，${entityHealth} §f!`);

            playSoundToPlayer(player, `beacon.activate`, 1, 1.5, 1, player.blockPos);

            const spawnParticlePos = new FloatPos(x + 0.5, y + 1, z + 0.5, block.pos.dimid);
            mc.spawnParticle(spawnParticlePos, `minecraft:sonic_explosion`); // minecraft:large_explosion | minecraft:sonic_explosion

            //logger.warn(`【${entityType === "player" ? "玩家捕捉的生物" : "发射器捕捉的生物"}】${entityType === "player" ? `玩家 ${data["capturedCreaturePlayer"]} 的` : ""} EntityUniqueID 为 ${data["capturedEntityUniqueID"]} 的 ${data["capturedEntityName"]} 成功释放!`);
            logger.warn(`【${entityType === "player" ? "玩家释放" : "发射器释放"}】${entityType === "player" ? `玩家 ${data["capturedCreaturePlayer"]} 的` : ""} ${data["capturedEntityName"]} 成功释放，位置：${spawnPos}!`);

            if (consumeItem) {
                //logger.warn(`消耗精灵球物品`);
                //clonedItem.getNbt().setByte("Count", clonedItem.count - 1);
                //player.getHand().setNbt(clonedItem.getNbt());
                player.getHand().setNull();
            } else {
                //logger.warn(`设置回普通精灵球物品`);
                //logger.warn(player.getHand().set(mc.newItem(projectileItem, 1)));
                player.getHand().set(mc.newItem(projectileItem, 1));
            }
            player.refreshItems();
        } else {
            player.tell(`${plugin_prefix} §c该生物数据删除失败，请联系服务器管理员!`);
            logger.error(`entityUniqueId 为 ${entityUniqueId} 的生物数据删除失败，请查看控制台和数据文件!`);
        }
    };

    if (entityType === "player") {
        // 遍历所有玩家的数据，查找匹配的 entityUniqueId
        let foundEntity = null;
        let ownerUUID = null;
        const playerCatch = entityData["playerCatch"] || {};
        for (const uuid in playerCatch) {
            const list = playerCatch[uuid];
            const entity = list.find(en => en["capturedEntityUniqueID"] === entityUniqueId);
            if (entity) {
                foundEntity = entity;
                ownerUUID = uuid;
                break;
            }
        }
        if (foundEntity) {
            spawnEntity(foundEntity, ownerUUID); // 传递所属玩家的 UUID
        } else {
            player.tell(`${plugin_prefix} §c该生物数据不存在或已损坏，请联系服务器管理员!`);
            logger.error(`玩家 ${player.realName} 释放生物失败：entityUniqueId 为 ${entityUniqueId} 的生物数据不存在或已损坏，请查看控制台和数据文件!`);
        }
    } else if (entityType === "dispenser") {
        const dispenserCatchData = entityData["dispenserCatch"] || [];
        const entity = dispenserCatchData.find(en => en["capturedEntityUniqueID"] === entityUniqueId);
        if (entity) {
            spawnEntity(entity); // dispenser 不需要 ownerUUID
        } else {
            player.tell(`${plugin_prefix} §c该生物数据不存在或已损坏，请联系服务器管理员!`);
            logger.error(`发射器释放生物失败：entityUniqueId 为 ${entityUniqueId} 的生物数据不存在或已损坏，请查看控制台和数据文件!`);
        }
    }
});

// 发射器/投掷器发射普通物品，仅在发射器/投掷器发射普通物品（非弹射物）时触发。拦截事件：函数返回false
mc.listen("onDispenseItem",
    (
    /** @type {FloatPos} 发射物品出现的位置*/pos,
    /** @type {Item} 被发射的物品对象*/item,
    /** @type {Integer} 容器中被取出物品的槽位索引*/slot,
    /** @type {Integer} 发射时方块朝向数值*/face,
    /** @type {Container} 发射器/投掷器的容器对象*/container
    ) => {
        /*
        if (item.isNull() || item.type !== normalItem || item.lore.length < 9) return;

        const clonedItem = item.clone();
        const lore = clonedItem.lore;
        const [entityUniqueId, type, entityName, entityHealth] = lore.slice(0, 4).map(line => line.replace(/§[a-zA-Z0-9]/g, ''));
        const entityType = type.split("：")[1];
        const entityData = JSON.parse(File.readFrom(`./plugins/${plugin_name}/data/pokeCatch.json`));
        const playerUUID = player.uuid;
        */
    }
);

/**
 * 
 * @param {Player | string} sourceType 
 * @param {string} msg 
 */
function sendMsgToPlayer(sourceType, msg) {
    if (/*typeof sourceType !== "string" && sourceType !== "dispenser" &&*/ typeof sourceType === "object") {
        sourceType.tell(plugin_prefix + msg);
    } else {
        mc.broadcast(plugin_prefix + msg);
    };
};

// 精灵球-弹射物-击中生物，并捕捉生物
mc.listen("onProjectileHitEntity",
    (
    /**@type {Entity} 被击中的实体对象*/entity,
    /**@type {Entity} 发射的弹射物实体（如箭）*/projectileEntity
    ) => {
        try {
            //logger.warn(entity.getNbt().getData("PreferredProfession"));
            if (projectileEntity && projectileEntity.type === projectileItem) {
                //(`弹射物：${projectileEntity.type}`);
                //logger.warn(`命中实体：${entity.type}`);
                const capturedEntityName = I18nAPI.get(entity.getTranslateKey(), [], "zh_CN");
                const health = `${entity.health} / ${entity.maxHealth}`;
                const entityNBT = entity.getNbt();
                const IsTamed = Boolean(entityNBT.getData("IsTamed"));
                const Saddled = Boolean(entityNBT.getData("Saddled"));
                const IsBaby = entity.isBaby;

                if (entityNBT.getData("TargetID") == undefined) { // 判断击中的是船等无TargetID的实体
                    mc.spawnItem(mc.newItem(projectileItem, 1), entity.pos);
                    return;
                };

                const TargetID = entityNBT.getData("TargetID").toString(); // 实体抱有敌意的目标的UniqueID

                const TargetPlayer = (TargetID != null && TargetID != "-1") ? (mc.getPlayer(TargetID) != null ? mc.getPlayer(TargetID) : TargetID) : false;

                const entityOwnerPlayerUniqueID = entityNBT.getData("OwnerNew").toString();

                const entityOwnerPlayer = (entityOwnerPlayerUniqueID != null && entityOwnerPlayerUniqueID != "-1")
                    ? (mc.getPlayer(entityOwnerPlayerUniqueID) != null ? mc.getPlayer(entityOwnerPlayerUniqueID) : entityOwnerPlayerUniqueID)
                    : false;

                const entityOwnerPlayerName = entityOwnerPlayer ? entityOwnerPlayer.realName : "无主人";

                // 玩家捕捉成功概率
                const player_percent = (playerNormalSuccessPercent < 0 || playerNormalSuccessPercent > 1)
                    ? 0.5 // 如果非法值则默认调整为 50%
                    : entity.isAngry
                        ? entityIsAngrySuccessPercent // 如果生物正在生气则默认调整为 entityIsAngrySuccessPercent 配置文件默认为 30%
                        : playerNormalSuccessPercent;

                // 发射器捕捉成功概率
                const dispenser_percent = (dispenserNormalSuccessPercent < 0 || dispenserNormalSuccessPercent > 1)
                    ? 0.5 : dispenserNormalSuccessPercent;


                const /**@type {Array<string>}*/capturableCreatures = plugin_config.get("capturableCreatures");

                let OwnerNew = projectileEntity.getNbt().getData("OwnerNew").toString(); // 根据弹射物实体获取OwnerNew（实体主人uniqueID）

                let sourceType = OwnerNew == "-1" ? "dispenser" : mc.getPlayer(OwnerNew);
                let player = sourceType;
                //logger.warn(`[1] ${player} | ${typeof player}`);
                
                let c = (typeof player === "string") ? true : entityOwnerPlayerUniqueID != player.uniqueId;

                let c2 = (typeof player === "object") ? player.gameMode !== 0 : false;
                let c3 = (typeof player === "object") ? !player.isSneaking : false;

                if (entity.isPlayer() || entity.isItemEntity()) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c玩家和掉落物不可被捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【456】提前return`);
                    return;
                }

                // 不可被捕捉的生物，（配置文件自定义）
                if (!capturableCreatures.includes(entity.type)) {
                    sendMsgToPlayer(sourceType, `§c该生物 <${capturedEntityName}> 被设置为不可被捕捉!`)
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【423】提前return`);
                    return;
                }

                // 拦截玩家捕捉他人领地内的生物
                if (typeof player === "object" && !LandJudgmentByPlayer(player, entity.blockPos)) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c不可在其他人的领地内捕捉生物!`)
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【432】提前return`);
                    return;
                } else { // 拦截发射器捕捉他人（任何人）领地内的生物
                    if (typeof player === "string" && !LandJudgmentByDispenser(entity.blockPos)) { // 代码层面写死
                        sendMsgToPlayer(sourceType, `§c不可在其他人的领地内捕捉生物!`)
                        playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                        spawnOrReturnFailedItem(player, entity, projectileItem);
                        //logger.warn(`【439】提前return`);
                        return;
                    }
                }

                if (entity.getNbt().getData("LeasherID") != -1) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c此生物正在被栓绳控制，不可被捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【448】提前return`);
                    return;
                }

                if (!entity.inWorld) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c该实体不在世界中!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【464】提前return`);
                    return;
                }

                // 此处为配置文件自定义
                if (judgeEntityIsSleeping && entity.isSleeping) {
                    sendMsgToPlayer(sourceType, `§c该生物正在睡觉中!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【473】提前return`);
                    return;
                }

                // 此处为配置文件自定义
                if (judgeEntityIsTrading && entity.isTrading) {
                    sendMsgToPlayer(sourceType, `§c该生物正在交易中!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【481】提前return`);
                    return;
                }

                if (judgeEntityCustomName && entity.getNbt().getData("CustomName") != null && c) {
                    sendMsgToPlayer(sourceType, `§c该生物已被命名，请确保您是它的驯服者后再次尝试捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【490】提前return`);
                    return;
                }

                // 此处为配置文件自定义
                if (judgePlayerGameModeIsSurvival && c2) {
                    sendMsgToPlayer(sourceType, `§c您只能在生存模式下捕捉生物!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【499】提前return`);
                    return;
                }

                // 此处为配置文件自定义
                if (judgePlayerIsSneaking && c3) {
                    sendMsgToPlayer(sourceType, `§c您只能在潜行状态下捕捉生物!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【508】提前return`);
                    return;
                }

                // 检查生物是否已被驯服并且驯服人是自己，配置文件自定义
                if (judgeEntityIsTamedByPlayer && IsTamed && c) {
                    sendMsgToPlayer(sourceType, `§c该生物未被您驯服，无法捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【517】提前return`);
                    return;
                }
                const currentHealthPercent = entity.health / entity.maxHealth;
                const configHealthPercent = (successHealthPercent < 0 || successHealthPercent > 1) ? 0.5 : successHealthPercent;

                //（如果驯服人是自己则不进行健康值百分比判断）
                if (judgeEntityHealthPercent && currentHealthPercent > configHealthPercent && c) {
                    sendMsgToPlayer(sourceType, `§c该生物的生命值需要在§a${configHealthPercent * entity.maxHealth}§c以下才能被捕捉！`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    //logger.warn(`【528】提前return`);
                    return;
                };


                const randomValue = Math.random();

                // 根据自定义概率进行判断
                if (typeof player === "object") { // 玩家捕捉时的成功率
                    if ((randomValue > player_percent)) {
                        if (c) { // 如果驯服人不是自己才进行概率判断，否则直接成功
                            playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                            if (Math.random() < damageRate) {
                                sendMsgToPlayer(sourceType, `§f${capturedEntityName}§c的挣扎破坏了精灵球`);
                                if (entity.type === "minecraft:breeze") projectileEntity.despawn(); // 修复旋风人刷精灵球bug
                                // 损坏的时候使精灵球弹射物消失（这里直接不使用spawnOrReturnFailedItem函数即可）
                            } else {
                                sendMsgToPlayer(sourceType, `§f${capturedEntityName}§c巧妙地躲过了精灵球`);
                                spawnOrReturnFailedItem(player, entity, projectileItem);
                            };
                            return;
                        };
                    };
                } else if (typeof player === "string") { // 发射器捕捉时的成功率
                    if ((randomValue > dispenser_percent)) {
                        playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                        if (Math.random() < damageRate) {
                            sendMsgToPlayer(sourceType, `§f${capturedEntityName}§c的挣扎破坏了发射器射出的精灵球，§e位置：${entity.blockPos}`);
                            if (entity.type === "minecraft:breeze") projectileEntity.despawn(); // 修复旋风人刷精灵球bug
                            // 损坏的时候使精灵球弹射物消失（这里直接不使用spawnOrReturnFailedItem函数即可）
                        } else {
                            sendMsgToPlayer(sourceType, `§f${capturedEntityName}§c巧妙地躲过了发射器射出的精灵球，§e位置：${entity.blockPos}`);
                            spawnOrReturnFailedItem(player, entity, projectileItem);
                        }
                        return;
                    };
                };


                // ==================== 捕捉成功 ==================== //

                // 捕捉成功时旋风人也会弹开精灵球弹射物，弹开的时候就会原地掉落精灵球，所以这里也需要直接提前使精灵球弹射物消失
                if (entity.type === "minecraft:breeze") projectileEntity.despawn();  // 修复旋风人刷精灵球bug

                // 根据捕获源是 玩家 还是 发射器 捕捉的生物 进行存储 不同的数据
                //logger.warn(`${player} | ${typeof player}`);
                //let tempTYPE = (player !== "dispenser") ? "PLAYER" : "DISPENSER";
                //logger.warn(tempTYPE);
                if (typeof player === "object") { // 捕获源是 玩家
                    //logger.warn(`捕获源是 玩家`);
                    // playerCatch
                    let playerCatch = plugin_data.get("playerCatch"); // 对象
                    if (!playerCatch[player.uuid]) {
                        Object.assign(playerCatch, {
                            [player.uuid]: [
                                {
                                    "capturedCreaturePlayer": player.realName,
                                    "capturedCreaturePlayerrUniqueID": player.uniqueId,
                                    "capturedEntityUniqueID": entity.uniqueId,
                                    "capturedEntityName": capturedEntityName,
                                    "capturedEntityTypeName": entity.type,
                                    "capturedEntityHealth": health,
                                    "capturedEntityPos": {
                                        "X": entity.pos.x,
                                        "Y": entity.pos.y,
                                        "Z": entity.pos.z,
                                        "Dimid": entity.pos.dimid
                                    },
                                    "capturedEntityisTrusting": entity.isTrusting,
                                    "capturedEntityIsTamed": IsTamed,
                                    "capturedEntitySaddled": Saddled,
                                    "capturedEntityIsBaby": IsBaby,
                                    "entityOwnerUniqueId": entityOwnerPlayerUniqueID,
                                    "entityOwnerName": entityOwnerPlayerName,
                                    "capturedEntityTypeSNBT": entityNBT.toSNBT()
                                }
                            ]
                        })
                    } else {
                        playerCatch[player.uuid].push(
                            {
                                "capturedCreaturePlayer": player.realName,
                                "capturedCreaturePlayerrUniqueID": player.uniqueId,
                                "capturedEntityUniqueID": entity.uniqueId,
                                "capturedEntityName": capturedEntityName,
                                "capturedEntityTypeName": entity.type,
                                "capturedEntityHealth": health,
                                "capturedEntityPos": {
                                    "X": entity.pos.x,
                                    "Y": entity.pos.y,
                                    "Z": entity.pos.z,
                                    "Dimid": entity.pos.dimid
                                },
                                "capturedEntityisTrusting": entity.isTrusting,
                                "capturedEntityIsTamed": IsTamed,
                                "capturedEntitySaddled": Saddled,
                                "capturedEntityIsBaby": IsBaby,
                                "entityOwnerUniqueId": entityOwnerPlayerUniqueID,
                                "entityOwnerName": entityOwnerPlayerName,
                                "capturedEntityTypeSNBT": entityNBT.toSNBT()
                            }
                        )
                    }
                    plugin_data.set("playerCatch", playerCatch);
                    plugin_data.reload();

                } else /*if (player === "dispenser")*/ { // 捕获源是 发射器
                    //logger.warn(`捕获源是 发射器`);
                    // dispenserCatch
                    let dispenserCatch = plugin_data.get("dispenserCatch"); // 数组
                    dispenserCatch.push(
                        {
                            "capturedCreatureSource": "dispenser",
                            "capturedCreatureSourceDate": system.getTimeStr(),
                            "capturedEntityUniqueID": entity.uniqueId,
                            "capturedEntityName": capturedEntityName,
                            "capturedEntityTypeName": entity.type,
                            "capturedEntityHealth": health,
                            "capturedEntityPos": {
                                "X": entity.pos.x,
                                "Y": entity.pos.y,
                                "Z": entity.pos.z,
                                "Dimid": entity.pos.dimid
                            },
                            "capturedEntityisTrusting": entity.isTrusting,
                            "capturedEntityIsTamed": IsTamed,
                            "capturedEntitySaddled": Saddled,
                            "capturedEntityIsBaby": IsBaby,
                            "entityOwnerUniqueId": entityOwnerPlayerUniqueID,
                            "entityOwnerName": entityOwnerPlayerName,
                            "capturedEntityTypeSNBT": entityNBT.toSNBT()
                        }
                    )

                    plugin_data.set("dispenserCatch", dispenserCatch);
                    plugin_data.reload();
                };

                plugin_data.reload();


                // 生成/给予掉落物物品，打造物品lore
                const isTamed = IsTamed ? `是` : `否`;
                const saddled = Saddled ? `是` : `否`;
                const isAdult = !IsBaby ? `是` : `否`;
                const villagerTypeNames = [
                    `minecraft:villager`,
                    `minecraft:villager_v2`,
                    `minecraft:zombie_villager`,
                    `minecraft:zombie_villager_v2`
                ];
                const ProfessionStrTransition = {
                    "farmer": "农民",
                    "fisherman": "渔夫",
                    "shepherd": "牧羊人",
                    "fletcher": "制箭师",
                    "cleric": "牧师",
                    "weaponsmith": "武器匠",
                    "armorer": "盔甲匠",
                    "toolsmith": "工具匠",
                    "librarian": "图书管理员",
                    "cartographer": "制图师",
                    "leatherworker": "皮匠",
                    "butcher": "屠夫",
                    "mason": "石匠",
                    "null": "无业"
                }
                const ProfessionStr = entity.getNbt().getData("PreferredProfession");
                const villagerProfession = villagerTypeNames.includes(entity.type)
                    ? (entity.getNbt().getData("PreferredProfession") != null ? `\n§a(职业：${ProfessionStrTransition[ProfessionStr]})§f ` : `\n§c无职业§f `)
                    : ` `;

                const type = (typeof player === "string") ? `dispenser` : `player`;
                const sourceName = (typeof player === `string`) ? `${entity.blockPos}的发射器` : player.realName;

                let item = mc.newItem(normalItem, 1);
                setItemEmptyEnch(item);
                if (typeof player === "object") {
                    player.refreshItems()
                };
                item.setDisplayName(plugin_config.get("pokeBallName") + `\n§f(${capturedEntityName})§a血量：§e${entity.health} / ${entity.maxHealth}§f${villagerProfession}`);
                let loreArr = [

                    `${entity.uniqueId}`,
                    `§r§b捕获类型：§d${type}`,
                    `§r§b类型：§e${capturedEntityName}`,
                    `§r§b血量：§e${entity.health} / ${entity.maxHealth}`,
                    `§r§b已驯服：§e${isTamed}`,
                    `§r§b驯服人：§e${entityOwnerPlayerName}`, // 显示文本和获取逻辑有待优化
                    `§r§b鞍：§e${saddled}`,
                    `§r§b已成年：§e${isAdult}`,
                    `§r§b捕获时间：§e${system.getTimeStr()}`,
                    `§r§b捕获者：§e${sourceName}` // 显示文本和获取逻辑有待优化

                ];
                // 对 TargetPlayer 进行进一步处理
                if (TargetPlayer) loreArr.push(`§r§b仇恨指向：§c${TargetPlayer.realName}`);

                item.setLore(loreArr); // 设置物品自定义Lore

                if (autoReturnItem) {
                    if (typeof player === "string") {
                        mc.spawnItem(item, entity.pos);
                    } else {
                        player.giveItem(item);
                    }
                } else {
                    mc.spawnItem(item, entity.pos);
                }

                const showResName = typeof player === "string" ? "发射器" : player.realName;

                mc.broadcast(`${plugin_prefix}${showResName} 抓住了一只${capturedEntityName}!，位置：${entity.blockPos}`); // ，位置：${entity.blockPos}

                logger.warn(`【${showResName === "发射器" ? "发射器捕捉" : "玩家捕捉"}】${showResName !== "发射器" ? `玩家 ${showResName}` : ""} 成功捕捉了 ${capturedEntityName}，位置：${entity.blockPos}!`);

                playSoundToPlayer(player, `random.bowhit`, 1, 1.5, 1, entity.blockPos); // random.pop | random.pop2
                //playSoundToPlayer(player, `beacon.deactivate`, 1, 1.5, 1, entity.blockPos);
                playSoundToPlayer(player, `ambient.weather.lightning.impact`, 1, 1.5, 1, entity.blockPos);

                const spawnParticlePos = new FloatPos(entity.pos.x + 0.5, entity.pos.y + 1, entity.pos.z + 0.5, entity.pos.dimid);
                mc.spawnParticle(spawnParticlePos, `minecraft:wind_explosion_emitter`); // wind_explosion_emitter | large_explosion
                /*for (let i = 0; i < 8; i++) {
                    mc.spawnParticle(spawnParticlePos, `minecraft:large_explosion`);
                }*/

                entity.despawn(); // 使被捕捉的实体刷新消失
            }
        } catch (error) {
            //logger.error(`${error}`);
            logger.error(`${error.message}`);
            logger.error(`${error.stack}`);
        }
    }
);

// 优化抓村民
//mc.listen("onPlayerInteractEntity", (player, entity, pos) => { if (entity.type.includes("villager") && player.getHand()?.type.includes("ed:ball")) return false; });

/**
 * 
 * @param {Player | string} player 玩家对象
 * @param {Entity} entity 被击中的实体对象，根据这个实体对象的位置生成掉落物
 * @param {string} ItemNameType 生成掉落物的标准类型名
 */
function spawnOrReturnFailedItem(player, entity, ItemNameType) {
    if (entity.type === "minecraft:breeze") return; // 旋风人会弹开精灵球，弹开的时候就会原地掉落精灵球，所以这里不需要再掉落或给予精灵球了
    let item = mc.newItem(ItemNameType, 1);
    item.setDisplayName(plugin_config.get("pokeBallName") + `\n§7(空空如也)`);
    if (autoReturnItem && typeof player === "object") {
        player.giveItem(item);
    } else {
        mc.spawnItem(item, entity.pos);
    }
};

mc.listen("onProjectileHitBlock",
    (
    /** @type {Block} 被击中的方块对象*/block,
    /**@type {Entity} 发射的弹射物实体（如箭）*/projectileEntity
    ) => {
        try {
            if (projectileEntity.type === projectileItem) {
                let OwnerNew = projectileEntity.getNbt().getData("OwnerNew").toString(); // 根据弹射物实体获取OwnerNew（实体主人uniqueID）
                if (mc.getPlayer(OwnerNew) == null) {
                    //throw new Error(`无法获取投掷弹射物 ${projectileItem} 的玩家对象：uniqueID：${OwnerNew} | 玩家对象：${mc.getPlayer(OwnerNew)}`);
                };
                let item = mc.newItem(projectileItem, 1);
                item.setDisplayName(plugin_config.get("pokeBallName") + `\n§7(空空如也)`);
                if (OwnerNew != "-1") { // 玩家发射出去的精灵球弹射物
                    if (mc.getPlayer(OwnerNew) != null) {
                        let /**@type {Player} 发射精灵球弹射物的玩家对象*/player = mc.getPlayer(OwnerNew);
                        player.tell(`${plugin_prefix}您空大了，落点：${block.pos}`);
                        playSoundToPlayer(player, `random.pop`, 1, 1.5, 1);
                        if (autoReturnItemWhenTargetEmpty) {
                            player.giveItem(item);
                        } else {
                            mc.spawnItem(item, block.pos);
                        };
                    } else {
                        mc.spawnItem(item, block.pos);
                    };
                } else { // 发射器发射出去的精灵球弹射物
                    mc.spawnItem(item, block.pos);
                };
            };
        } catch (error) {
            logger.error(error.message);
            logger.error(error.stack);
        };
    }
);

/**
 * 
 * @param {string} type dispenser | player
 * @param {string} playerUUID 
 * @param {string} capturedEntityUniqueID 
 * @returns 
 */
function removeEntityData(type, playerUUID, capturedEntityUniqueID) {
    try {
        let obj = JSON.parse(File.readFrom(`./plugins/${plugin_name}/data/pokeCatch.json`));
        switch (type) {
            case "player":
                let playerCatchData = plugin_data.get("playerCatch");
                if (!playerCatchData[playerUUID]) {
                    return false;
                }
                if (obj["playerCatch"].hasOwnProperty(playerUUID)) {
                    obj["playerCatch"][playerUUID] = obj["playerCatch"][playerUUID].filter(en => en["capturedEntityUniqueID"] !== capturedEntityUniqueID);
                } else {
                    return false;
                }
                // 定义一个变量来获取最终过滤后的 playerCatch 对象
                const finalPlayerCatch = obj["playerCatch"];

                plugin_data.set("playerCatch", finalPlayerCatch);
                plugin_data.reload();

                return true;

            case "dispenser":
                obj["dispenserCatch"] = obj["dispenserCatch"].filter(en => en["capturedEntityUniqueID"] !== capturedEntityUniqueID);
                // 定义一个变量来获取最终过滤后的 dispenserCatch 对象
                const finalDispenserCatchData = obj["dispenserCatch"];

                plugin_data.set("dispenserCatch", finalDispenserCatchData);
                plugin_data.reload();

                return true;
            default:
                return null;
        }
    } catch (error) {
        logger.error(`removeEntityData 函数发生错误：${error.message}`);
        logger.error(`removeEntityData 函数发生错误：${error.stack}`);
        return undefined;
    }
};

/**
 * 
 * @param {string} entityName 要生成实体的标准类型名
 * @param {IntPos | FloatPos} pos 要生成实体的坐标
 * @param {string} SNBT 要生成实体的实体SNBT
 */
function spawnEntityWithSNBT(entityName, pos, SNBT) {
    try {
        const readNBT = NBT.parseSNBT(SNBT);

        if (!readNBT) {
            logger.error(`函数：spawnEntityWithSNBT(entityName, pos, SNBT) 生成生物失败：readNBT 为 ${readNBT}`);
            return false;
        }

        const newNBT = modifyEntityPosition(readNBT, pos.x, pos.y, pos.z);

        if (!newNBT) {
            logger.error(`函数：spawnEntityWithSNBT(entityName, pos, SNBT) 生成生物失败：newNBT 为 ${newNBT}`);
            return false;
        };

        const entity = mc.spawnMob(entityName, pos);

        if (entity == null || entity == undefined) {
            logger.error(`函数：spawnEntityWithSNBT(entityName, pos, SNBT) 生成生物失败：entity 为 ${entity}`);
            return false;
        }

        entity.setNbt(newNBT);

        return true;

    } catch (error) {
        logger.error(error.message);
        logger.error(error.stack);
        return undefined;
    }
};

/**
* 
* @param {NbtCompound} entityNbt 
* @param {number} newPosX 
* @param {number} newPosY 
* @param {number} newPosZ 
* @returns 
*/
function modifyEntityPosition(entityNbt, newPosX, newPosY, newPosZ) {
    // 获取实体的 NBT 数据
    let nbt = entityNbt;
    if (!nbt) return false;

    // 检查 NBT 数据中是否包含 "Pos" 字段
    if (nbt.getData("Pos")) {
        let newPosList = new NbtList([
            new NbtFloat(newPosX),
            new NbtFloat(newPosY),
            new NbtFloat(newPosZ)
        ]);
        nbt.setTag("Pos", newPosList);
    } else {
        return false;
    }
    // 返回修改后的 NBT 数据
    return nbt;
};

/**
* 给物品设置空附魔
* @param {Item} item 要设置空附魔的物品对象
*/
function setItemEmptyEnch(item) {
    // 获取当前物品的 NBT 数据
    let currentNbt = item.getNbt();
    let tag = currentNbt.getData("tag");
    if (!tag) {
        // 创建一个新的 NBT 数据结构，包含空的附魔列表
        const newTag = new NbtCompound({
            "ench": new NbtList()
        });

        // 更新物品的 NBT 数据
        return (currentNbt.setTag("tag", newTag) && item.setNbt(currentNbt));
    } else {
        return false;
    }
};

/**
 * 
 * @param {number} dimid 要执行指令的维度ID
 * @param {string} cmd 要执行的指令字符串
 */
function runCmdInAnyDimid(dimid, cmd) {
    if (dimid === 0) {
        mc.runcmdEx(`execute in overworld run ${cmd}`);
    } else if (dimid === 1) {
        mc.runcmdEx(`execute in nether run ${cmd}`);
    } else if (dimid === 2) {
        mc.runcmdEx(`execute in the_end run ${cmd}`);
    }
};
/**
 * 
 * @param {Player | string} player 玩家对象
 * @param {string} soundID 音效ID字符串
 * @param {number} volume 音量数值,定声音能被听见的距离。必须至少为0.0。对小于1.0的值，声音会相对减轻，球状可闻范围会相对小。对大于1.0的值，声音不会实际上增大，但其可闻范围（1.0时半径为16米）会与音量相乘。声音总会基于与球体中心的距离逐渐衰减至无声。默认为1.0。
 * @param {number} pitch 音调，该数字没有特别限制，但是必须要在0.0至256.0之间才有对应效果。高于256.0的值与默认值的效果相同。小于等于0.0的值会导致听不到该声音。
 * @param {number} minimumVolume 定在声音可闻范围外的目标能听到的音量。若目标在可闻范围外，作为补偿，声源会被放置在距离目标较近的位置（距离小于4格），而-{}-最小音量会决定补偿声源的音量。
 * @param {IntPos} pos 要播放音效的坐标，仅在发射精灵球弹射物的来源是发射器时有效
 */
function playSoundToPlayer(player, soundID, volume, pitch, minimumVolume, pos) {
    if (typeof player === "object") {
        runCmdInAnyDimid(player.pos.dimid, `playsound ${soundID} "${player.realName}" ${player.feetPos.x} ${player.feetPos.y + 1} ${player.feetPos.z} ${volume} ${pitch} ${minimumVolume}`);
    } else {
        //runCmdInAnyDimid(pos.dimid, `playsound ${soundID} @a ${pos.x} ${pos.y} ${pos.z} ${volume} ${pitch} ${minimumVolume}`);
    };
};