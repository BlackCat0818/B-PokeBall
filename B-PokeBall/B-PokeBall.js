// LiteLoader-AIDS automatic generated
/// <reference path="c:\LSE-API/dts/helperlib/src/index.d.ts"/> 


const PLUGIN_NAME = "B-PokeBall";
const PLUGIN_VERSION = [1, 0, 1, Version.Release];
const plugin_prefix = `§a§l[Poke] §r`;

ll.registerPlugin(
    PLUGIN_NAME,
    `精灵球插件：捕捉与释放生物`,
    PLUGIN_VERSION,
    { "作者qq": "3096514973" }
);

function getTodayLogPath(type) {
    switch (type) {
        case "release": return `./logs/${PLUGIN_NAME}/${PLUGIN_NAME}-release/${PLUGIN_NAME}-release-${system.getTimeStr().substr(0, 10)}.csv`;
        case "catch": return `./logs/${PLUGIN_NAME}/${PLUGIN_NAME}-catch/${PLUGIN_NAME}-catch-${system.getTimeStr().substr(0, 10)}.csv`;
        default: return `./logs/${PLUGIN_NAME}/${PLUGIN_NAME}-${system.getTimeStr().substr(0, 10)}.csv`;
    };
};

// ========== 日志写入 ==========
function writeLog(type, source, action, entity, pos) {
    const logPath = getTodayLogPath(type);
    const fileExists = File.readFrom(logPath);
    if (!fileExists) {
        logger.warn(`已创建今日精灵球日志：${logPath}`);
        const header = "\ufeff时间,玩家,动作,生物,坐标\n";
        File.writeTo(logPath, header);
    }
    const timeStr = system.getTimeStr(); // 格式: 2026-08-15 19:15:01
    const line = `${timeStr},${source},${action},${entity},${pos}`;
    File.writeLine(logPath, line);
};

const { I18nAPI, Minecraft } = require('./GMLIB-LegacyRemoteCallApi/lib/GMLIB_API-JS'); // 翻译实体名称用的

Minecraft.setFixI18nEnabled();

const normalItem = "ed:ball_1"; // 普通物品精灵球
const projectileItem = "ed:ball"; // 投掷物精灵球

const CONFIG_PATH = `./plugins/${PLUGIN_NAME}/config/config.json`;
const CONFIG = new JsonConfigFile(CONFIG_PATH, JSON.stringify(
    {
        "pokeBallName": "§d§l精灵球§r", // 精灵球的名称
        // 允许被捕捉的生物列表
        "capturableCreatures": {
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
            "minecraft:armadillo": "犰狳",
            "minecraft:happy_ghast": "快乐恶魂",
            "minecraft:breeze": "旋风人"
        },
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

const villagerTypeNames = [
    `minecraft:villager`,
    `minecraft:villager_v2`,
    //`minecraft:zombie_villager`,
    //`minecraft:zombie_villager_v2`
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
};

function getConfig(params) {
    const raw = File.readFrom(CONFIG_PATH);
    return raw ? JSON.parse(raw)[params] : null;
}

/**
 * 判断玩家所在坐标是否有权限
 * @param {Player} Player 玩家对象
 * @param {IntPos} Pos 方块的坐标对象
 */
function LandJudgmentByPlayer(Player, Pos) {
    if (!getConfig("globalLandJudge")) return true;

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
    if (!getConfig("globalLandJudge")) return true;
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
    const command = mc.newCommand(`poke`, `查询可捕捉的生物列表`, PermType.Any);
    command.overload([]);
    command.setCallback((cmd, ori, out, res) => {
        const player = ori.player;
        // 假设 getConfig 返回一个对象 { "minecraft:pig": "猪", ... }
        const /**@type {Object<string,string>}*/ list = getConfig("capturableCreatures");
        let newlist = [];
        let originalCount = 0;
        let addonCount = 0;

        // 遍历对象的每个键值对
        for (const [id, displayName] of Object.entries(list)) {

            // 根据 ID 前缀分类
            if (id.startsWith("minecraft:")) {
                newlist.push(`§a原版：§e${displayName} §7(${id})`);
                originalCount += 1;
            } else {
                newlist.push(`§dAddOn：§b${displayName} §7(${id})`);
                addonCount += 1;
            };
        };

        if (!player) {
            return out.success(`精灵球-可捕捉的生物列表\n共 ${newlist.length} 种，包含原版生物 ${originalCount} 种，addon生物 ${addonCount} 种\n${newlist.join("\n")}`);
        };

        let form = mc.newCustomForm();
        form.setTitle(`精灵球-可捕捉的生物列表`);
        form.addLabel(`共 ${newlist.length} 种，包含原版生物 ${originalCount} 种，addon生物 ${addonCount} 种\n${newlist.join("\n")}`);
        player.sendForm(form, (pl, id) => {
            if (id == null) return;
        });
    });
    command.setup();
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
            throw new Error("无效的 side 值，必须在0~5之间。");
    };

    return [x, y, z];
};

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

// ============================== 玩家释放生物 ==============================
let lastTriggerTime = 0;
const debounceTime = 200; // 防抖时间间隔，单位为毫秒（推荐50~100）

mc.listen("onUseItemOn", (player, item, block, side, pos) => { // 75行释放生物
    try {
        // 判断玩家手中物品是否是精灵球物品
        if (item.isNull() || item.type !== normalItem || item.lore.length < 9 || filterList.includes(item.type)
            || block.hasContainer() || block.isButtonBlock || block.isDoorBlock || block.isThinFenceBlock || block.isFenceGateBlock || block.isFenceBlock
            || block.type.endsWith("_trapdoor")
        ) {
            return;
        };

        // 冷却时间-防抖
        const currentTime = Date.now();
        if (currentTime - lastTriggerTime < debounceTime) return;
        lastTriggerTime = currentTime;

        // 读取物品lore
        const clonedItem = item.clone();
        const lore = clonedItem.lore;
        const [entityUniqueId, type, entityName, entityHealth] = lore.slice(0, 4).map(line => line.replace(/§[a-zA-Z0-9]/g, ''));
        const entityType = type.split("：")[1];
        const playerUUID = player.uuid;

        if (getConfig("releaseEntityIsNeedPlayerIsSneaking") && !player.isSneaking) {
            player.tell(plugin_prefix + `§c只有当您潜行时才能释放生物!`);
            return;
        }
        if (getConfig("releaseEntityNeedsLandPerm") && !LandJudgmentByPlayer(player, player.blockPos)) {
            player.tell(plugin_prefix + `§c禁止在他人领地内释放生物!`);
            return;
        }

        // 释放生物核心逻辑：从精灵球物品NBT中读取实体SNBT数据
        const snbt = getEntitySnbtInItem(item);
        if (snbt) {
            const nbt = NBT.parseSNBT(snbt);
            if (!nbt) {
                logger.error(`onUseItemOn : nbt 获取失败 : ${nbt}`);
                return;
            };

            const entityNameSpace = nbt.getData("identifier");
            //logger.warn(`entityNameSpace 的值：${entityNameSpace}，数据类型：${typeof entityNameSpace}`);
            if ([null, undefined].includes(entityNameSpace) || typeof entityNameSpace !== "string") {
                logger.error(`玩家 ${player.realName} 在 onUseItemOn 中执行释放生物时失败: 生物的命名空间名称 - entityNameSpace 的值为 ${entityNameSpace}`);
                return;
            };

            // 设置实体生成位置
            const [x, y, z] = getOffsetCoordinates([block.pos.x, block.pos.y, block.pos.z], side);
            const spawnPos = new FloatPos(x + 0.5, y, z + 0.5, block.pos.dimid);

            // 释放生物主要逻辑：先修改生物的NBT数据，包括坐标，然后再生成生物
            const spawnedEntity = spawnEntityWithSNBT(entityNameSpace, spawnPos, snbt);
            if (!spawnedEntity) {
                logger.error(`玩家 ${player.realName} 在 onUseItemOn 中执行释放生物时失败: spawnEntityWithSNBT 返回的 spawnedEntity 为 ${spawnedEntity}`);
                return;
            }

            const isVillager = villagerTypeNames.includes(spawnedEntity.type);
            const professionKey = isVillager && spawnedEntity.getNbt().getData("PreferredProfession");
            const villagerProfessionPlain = isVillager ? (professionKey ? ProfessionStrTransition[professionKey] : "无职业") : "";
            const releaseDisplayName = isVillager ? `${entityName} (职业：${villagerProfessionPlain})` : `${entityName}`;
            const releaseHealth = `${entityHealth}`;

            // 给玩家更友好的释放提示，包含职业与血量
            player.tell(plugin_prefix + `§a释放成功 §7| §f${releaseDisplayName} §7| §c${releaseHealth}`);
            logger.warn(`【玩家释放】玩家 ${player.realName} 成功释放 ${releaseDisplayName}(${releaseHealth})，位置：${spawnPos}!`);

            // 写入日志时使用更完整的信息（不带颜色码，便于分析）
            writeLog("release", `${player.realName}`, "释放", `${releaseDisplayName} ${releaseHealth}`, `${spawnedEntity.blockPos}`);

            playSoundToPlayer(player, `beacon.activate`, 1, 1.5, 1, player.blockPos);

            const spawnParticlePos = new FloatPos(x + 0.5, y + 1, z + 0.5, block.pos.dimid);
            mc.spawnParticle(spawnParticlePos, `minecraft:sonic_explosion`); // minecraft:large_explosion | minecraft:sonic_explosion

            if (getConfig("consumeItem")) {
                player.getHand().setNull();
            } else {
                player.getHand().set(mc.newItem(projectileItem, 1));
            }
            player.refreshItems();

        };
    } catch (error) {
        logger.error(error.message);
        logger.error(error.stack);
    };
});

// ============================== 发射器/投掷器释放生物 ==============================
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

// ============================== 玩家或发射器使用精灵球弹射物捕捉生物 ==============================
mc.listen("onProjectileHitEntity",
    (
    /**@type {Entity} 被击中的实体对象*/entity,
    /**@type {Entity} 发射的弹射物实体（如箭）*/projectileEntity
    ) => {

        try {
            if (projectileEntity && projectileEntity.type === projectileItem) {

                const projectileEntityNbt = projectileEntity.getNbt();

                const entityNbt = entity.getNbt();
                if (!entityNbt) {
                    logger.error(`onProjectileHitEntity : entityNbt : ${entityNbt}`);
                    return;
                }

                const capturedEntityName = I18nAPI.get(entity.getTranslateKey(), [], "zh_CN");
                const health = `${entity.health} / ${entity.maxHealth}`;

                const IsTamed = Boolean(entityNbt.getData("IsTamed"));
                const Saddled = Boolean(entityNbt.getData("Saddled"));
                const IsBaby = entity.isBaby;

                const targetIdData = entityNbt.getData("TargetID");
                if (targetIdData == undefined) {
                    mc.spawnItem(mc.newItem(projectileItem, 1), entity.pos);
                    return;
                }
                const TargetID = targetIdData.toString();
                const TargetPlayer = TargetID !== "-1" ? (mc.getPlayer(TargetID) || TargetID) : false;

                const entityOwnerPlayerUniqueID = entityNbt.getData("OwnerNew").toString();

                const entityOwnerPlayer = (entityOwnerPlayerUniqueID != null && entityOwnerPlayerUniqueID != "-1")
                    ? (mc.getPlayer(entityOwnerPlayerUniqueID) != null ? mc.getPlayer(entityOwnerPlayerUniqueID) : entityOwnerPlayerUniqueID)
                    : false;

                const entityOwnerPlayerName = entityOwnerPlayer ? entityOwnerPlayer.realName : "无主人"; // 驯服人

                const playerNormalSuccessPercent = getConfig("playerNormalSuccessPercent");
                const dispenserNormalSuccessPercent = getConfig("dispenserNormalSuccessPercent");
                const entityIsAngrySuccessPercent = getConfig("entityIsAngrySuccessPercent");

                // 玩家捕捉成功概率
                const player_percent = (playerNormalSuccessPercent < 0 || playerNormalSuccessPercent > 1)
                    ? 0.5 // 如果非法值则默认调整为 50%
                    : entity.isAngry
                        ? entityIsAngrySuccessPercent // 如果生物正在生气则默认调整为 entityIsAngrySuccessPercent 配置文件默认为 30%
                        : playerNormalSuccessPercent;

                // 发射器捕捉成功概率
                const dispenser_percent = (dispenserNormalSuccessPercent < 0 || dispenserNormalSuccessPercent > 1)
                    ? 0.5 : dispenserNormalSuccessPercent;

                const capturableCreatures = Object.keys(getConfig("capturableCreatures"));

                const OwnerNew = projectileEntityNbt.getData("OwnerNew").toString(); // 根据弹射物实体获取OwnerNew（实体主人uniqueID）

                const sourceType = OwnerNew == "-1" ? "dispenser" : mc.getPlayer(OwnerNew);
                const player = sourceType;

                const c = (typeof player === "string") ? true : entityOwnerPlayerUniqueID != player.uniqueId;

                const c2 = (typeof player === "object") ? player.gameMode !== 0 : false;
                const c3 = (typeof player === "object") ? !player.isSneaking : false;

                if (entity.isPlayer() || entity.isItemEntity()) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c玩家和掉落物不可被捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                // 不可被捕捉的生物，（配置文件自定义）
                if (!capturableCreatures.includes(entity.type)) {
                    sendMsgToPlayer(sourceType, `§c该生物 <${capturedEntityName}> 被设置为不可被捕捉!`)
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                // 拦截玩家捕捉他人领地内的生物
                if (typeof player === "object" && !LandJudgmentByPlayer(player, entity.blockPos)) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c不可在其他人的领地内捕捉生物!`)
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                } else { // 拦截发射器捕捉他人（任何人）领地内的生物
                    if (typeof player === "string" && !LandJudgmentByDispenser(entity.blockPos)) { // 代码层面写死
                        sendMsgToPlayer(sourceType, `§c不可在其他人的领地内捕捉生物!`)
                        playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                        spawnOrReturnFailedItem(player, entity, projectileItem);
                        return;
                    }
                }

                if (entityNbt.getData("LeasherID") != -1) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c此生物正在被栓绳控制，不可被捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                if (!entity.inWorld) { // 代码层面写死
                    sendMsgToPlayer(sourceType, `§c该实体不在世界中!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                // 此处为配置文件自定义 
                if (getConfig("judgeEntityIsSleeping") && entity.isSleeping) {
                    sendMsgToPlayer(sourceType, `§c该生物正在睡觉中!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                // 此处为配置文件自定义
                if (getConfig("judgeEntityIsTrading") && entity.isTrading) {
                    sendMsgToPlayer(sourceType, `§c该生物正在交易中!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                if (getConfig("judgeEntityCustomName") && entityNbt.getData("CustomName") != null && c) {
                    sendMsgToPlayer(sourceType, `§c该生物已被命名，请确保您是它的驯服者后再次尝试捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                // 此处为配置文件自定义
                if (getConfig("judgePlayerGameModeIsSurvival") && c2) {
                    sendMsgToPlayer(sourceType, `§c您只能在生存模式下捕捉生物!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                // 此处为配置文件自定义
                if (getConfig("judgePlayerIsSneaking") && c3) {
                    sendMsgToPlayer(sourceType, `§c您只能在潜行状态下捕捉生物!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }

                // 检查生物是否已被驯服并且驯服人是自己，配置文件自定义
                if (getConfig("judgeEntityIsTamedByPlayer") && IsTamed && c) {
                    sendMsgToPlayer(sourceType, `§c该生物未被您驯服，无法捕捉!`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                }
                const successHealthPercent = getConfig("judgeEntityHealthPercent")["successHealthPercent"];
                const currentHealthPercent = entity.health / entity.maxHealth;
                const configHealthPercent = (successHealthPercent < 0 || successHealthPercent > 1) ? 0.5 : successHealthPercent;

                //（如果驯服人是自己则不进行健康值百分比判断）
                if (getConfig("judgeEntityHealthPercent")["enable"] && currentHealthPercent > configHealthPercent && c) {
                    sendMsgToPlayer(sourceType, `§c该生物的生命值需要在§a${configHealthPercent * entity.maxHealth}§c以下才能被捕捉！`);
                    playSoundToPlayer(player, `random.pop2`, 1, 1.5, 1, entity.blockPos);
                    spawnOrReturnFailedItem(player, entity, projectileItem);
                    return;
                };


                const randomValue = Math.random();
                const damageRate = getConfig("damageRate");

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

                // 生成/给予掉落物物品，打造物品lore
                const isTamed = IsTamed ? `是` : `否`;
                const saddled = Saddled ? `是` : `否`;
                const isAdult = !IsBaby ? `是` : `否`;

                const ProfessionStr = entityNbt.getData("PreferredProfession");
                const villagerProfession = villagerTypeNames.includes(entity.type) ? (ProfessionStr != null ? `\n§a(职业：${ProfessionStrTransition[ProfessionStr]})§f ` : `\n§c无职业§f `) : ` `;

                const type = (typeof player === "string") ? `dispenser` : `player`;
                const sourceName = (typeof player === `string`) ? `发射器(${entity.blockPos})` : player.realName;

                const item = mc.newItem(normalItem, 1);
                setItemEmptyEnch(item);
                if (typeof player === "object") player.refreshItems();

                item.setDisplayName(getConfig("pokeBallName") + `\n§f(${capturedEntityName})§a血量：§e${entity.health} / ${entity.maxHealth}§f${villagerProfession}`);
                const loreArr = [

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

                //logger.warn(`setEntitySnbtToItemNbtTag(item, entityNbt?.toSNBT(4)) : `, setEntitySnbtToItemNbtTag(item, entityNbt?.toSNBT(4)));
                setEntitySnbtToItemNbtTag(item, entityNbt?.toSNBT(4));

                if (getConfig("autoReturnItem")) {
                    if (type === "dispenser") {
                        mc.spawnItem(item, entity.pos);
                    } else {
                        player.giveItem(item);
                    };
                } else {
                    mc.spawnItem(item, entity.pos);
                };

                const pfs = entityNbt.getData("PreferredProfession");
                const vpfsPlain = villagerTypeNames.includes(entity.type) ? (pfs != null ? ProfessionStrTransition[pfs] : "无职业") : "";
                const vpfs = villagerTypeNames.includes(entity.type) ? `(${vpfsPlain === "" ? "无职业" : `职业：${vpfsPlain}`})` : "";
                const entityHealth = `${entity.health} / ${entity.maxHealth}`;

                // 更加美观的广播信息，包含职业（若为村民）、血量与位置
                mc.broadcast(plugin_prefix + `§6${sourceName} §f捕获了 §a${capturedEntityName} §7${vpfs} §7| (§e血量: §c${entityHealth})`); // §7| §b位置: §f${entity.blockPos}
                logger.warn(`【${type === "dispenser" ? "发射器捕捉" : "玩家捕捉"}】${type !== "dispenser" ? `玩家 ${sourceName}` : sourceName} 成功捕捉了 ${capturedEntityName}${vpfs}(血量${entityHealth})，位置：${entity.blockPos}!`);

                // 日志记录使用无颜色的结构化信息
                writeLog("catch", `${sourceName}`, "捕捉", `${capturedEntityName} ${vpfs} (血量${entityHealth})`, `${entity.blockPos}`);

                playSoundToPlayer(player, `random.bowhit`, 1, 1.5, 1, entity.blockPos); // random.pop | random.pop2
                playSoundToPlayer(player, `ambient.weather.lightning.impact`, 1, 1.5, 1, entity.blockPos);

                const spawnParticlePos = new FloatPos(entity.pos.x + 0.5, entity.pos.y + 1, entity.pos.z + 0.5, entity.pos.dimid);
                mc.spawnParticle(spawnParticlePos, `minecraft:wind_explosion_emitter`); // wind_explosion_emitter | large_explosion

                if (type === "player") player.refreshItems();

                entity.despawn(); // 使被捕捉的实体刷新消失

            };
        } catch (error) {
            logger.error(error.message);
            logger.error(error.stack);
        }
    }
);

/**
 * 
 * @param {Player | string} player 玩家对象
 * @param {Entity} entity 被击中的实体对象，根据这个实体对象的位置生成掉落物
 * @param {string} ItemNameType 生成掉落物的标准类型名
 */
function spawnOrReturnFailedItem(player, entity, ItemNameType) {
    // 单独处理旋风人
    if (entity.type === "minecraft:breeze") return; // 旋风人会弹开精灵球，弹开的时候就会原地掉落精灵球，所以这里不需要再掉落或给予精灵球了

    const item = mc.newItem(ItemNameType, 1);
    item.setDisplayName(getConfig("pokeBallName") + `\n§7(空空如也)`);
    if (getConfig("autoReturnItem") && typeof player === "object") {
        player.giveItem(item);
    } else {
        mc.spawnItem(item, entity.pos);
    }
};

// 精灵球弹射物击中方块原地生成掉落物或给予玩家物品-当玩家“空大”时返回物品
mc.listen("onProjectileHitBlock",
    (
    /** @type {Block} 被击中的方块对象*/block,
    /**@type {Entity} 发射的弹射物实体（如箭）*/projectileEntity
    ) => {
        try {
            if (projectileEntity.type === projectileItem) {

                // 根据弹射物实体获取OwnerNew（实体主人uniqueID）
                const projectileEntityNbt = projectileEntity.getNbt();
                if (!projectileEntityNbt) {
                    logger.error(`onProjectileHitBlock : projectileEntityNbt : ${projectileEntityNbt}`);
                    return;
                }
                const OwnerNew = projectileEntityNbt.getData("OwnerNew").toString();

                const item = mc.newItem(projectileItem, 1);
                if (item) {
                    item.setDisplayName(getConfig("pokeBallName") + `\n§7(空空如也)`);
                }
                if (OwnerNew != "-1") { // 玩家发射出去的精灵球弹射物
                    if (mc.getPlayer(OwnerNew) != null) {

                        const /**@type {Player} 发射精灵球弹射物的玩家对象*/player = mc.getPlayer(OwnerNew);

                        player.tell(plugin_prefix + `您空大了，落点：${block.pos}`);

                        playSoundToPlayer(player, `random.pop`, 1, 1.5, 1);

                        if (getConfig("autoReturnItemWhenTargetEmpty")) {
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
}

/**
 * 将实体的SNBT字符串设置到精灵球物品的NBT中
 * @param {Item} item 精灵球的物品对象
 * @param {string} SNBT 被捕捉的实体的SNBT字符串
 * @returns {Boolean} 是否设置成功
 */
function setEntitySnbtToItemNbtTag(item, SNBT) {
    if (!item) return false;
    // 获取物品的NBT数据
    let nbt = item.getNbt();

    // 处理无NBT或非Compound类型的情况
    if (!nbt || nbt.getType() !== NBT.Compound) {
        // 创建新的顶层Compound
        nbt = new NbtCompound();
    }

    // 获取或创建tag复合标签
    let tag = nbt.getTag("tag");
    if (!tag || tag.getType() !== NBT.Compound) {
        // 创建新的tag Compound
        tag = new NbtCompound();
        tag.setString("entitySnbt", SNBT);
        // 将新tag添加到顶层NBT
        nbt.setTag("tag", tag);
    }

    tag.setString("entitySnbt", SNBT);

    // 更新物品NBT并返回结果
    return item.setNbt(nbt);
}

/**
 * 从精灵球物品的NBT中获取实体的SNBT字符串
 * @param {Item} item 物品对象
 * @returns 
 */
function getEntitySnbtInItem(item) {

    if (!item) return false;
    const nbt = item.getNbt();
    // 无NBT或非Compound类型直接返回false
    if (!nbt || nbt.getType() !== NBT.Compound) return false;

    // 获取tag复合标签
    const tag = nbt.getTag("tag");
    // 无tag或非Compound类型直接返回false
    if (!tag || tag.getType() !== NBT.Compound) return false;

    // 直接获取数据值（避免额外对象操作）
    const entitySnbt = tag.getData("entitySnbt");
    return entitySnbt ? entitySnbt : null;
}

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

        return entity;

    } catch (error) {
        logger.error(error.message);
        logger.error(error.stack);
        return undefined;
    }
};

/**
 * 
 * @param {Item} item 
 * @returns 
 */
function setItemEmptyEnch(item) {
    // 获取当前物品的 NBT 数据
    let currentNbt = item.getNbt();
    if (!currentNbt) {
        logger.error(`setItemEmptyEnch(item) : currentNbt : item 的 nbt 获取失败 : ${currentNbt}`);
        return false;
    };
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
 * 执行指令，兼容主世界、下界、末地三个维度
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
 * 给玩家播放音效
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