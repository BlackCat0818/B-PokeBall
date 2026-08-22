// LiteLoader-AIDS automatic generated
/// <reference path="d:\LLSE-API/dts/helperlib/src/index.d.ts"/> 

const PLUGIN_NAME = "B-PokeBall";
const PLUGIN_VERSION = [1, 0, 2, Version.Release];
const plugin_prefix = `§a§l[Poke] §r`;

ll.registerPlugin(
    PLUGIN_NAME,
    `精灵球插件：捕捉与释放生物 (优化版)`,
    PLUGIN_VERSION,
    { "作者qq": "3096514973" }
);

// ==================== 常量定义 ====================
const normalItem = "ed:ball_1";
const projectileItem = "ed:ball";

const villagerTypeNames = [
    "minecraft:villager",
    "minecraft:villager_v2"
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

// ==================== 配置管理（带缓存和热重载）====================
const CONFIG_PATH = `./plugins/${PLUGIN_NAME}/config/config.json`;
let configCache = null;
let configReloadInterval = null;

const DEFAULT_CONFIG = {
    "pokeBallName": "§d§l精灵球§r",
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
        "minecraft:mule": "骡",
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
    "playerNormalSuccessPercent": 0.65,
    "dispenserNormalSuccessPercent": 0.65,
    "damageRate": 0.70,
    "entityIsAngrySuccessPercent": 0.25,
    "consumeItem": false,
    "autoReturnItem": true,
    "autoReturnItemWhenTargetEmpty": true,
    "judgeEntityHealthPercent": {
        "enable": false,
        "successHealthPercent": 0.9
    },
    "globalLandJudge": false,
    "releaseEntityNeedsLandPerm": true,
    "releaseEntityIsNeedPlayerIsSneaking": true,
    "judgeEntityCustomName": true,
    "judgeEntityIsSleeping": true,
    "judgeEntityIsTrading": true,
    "judgePlayerGameModeIsSurvival": true,
    "judgePlayerIsSneaking": false,
    "judgeEntityIsTamedByPlayer": false
};

function loadConfig() {
    const conf = new JsonConfigFile(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 4));
    let raw = File.readFrom(CONFIG_PATH);
    if (!raw) {
        File.writeTo(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 4));
        raw = File.readFrom(CONFIG_PATH);
    }
    try {
        configCache = JSON.parse(raw);
    } catch (e) {
        logger.error(`配置文件解析失败: ${e}`);
        configCache = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
    if (configCache.capturableCreatures) {
        configCache._capturableSet = new Set(Object.keys(configCache.capturableCreatures));
    } else {
        configCache._capturableSet = new Set();
    }
    logger.info(`配置文件已加载，共 ${configCache._capturableSet.size} 种可捕捉生物`);
}

function reloadConfig() {
    const oldHash = JSON.stringify(configCache);
    const raw = File.readFrom(CONFIG_PATH);
    if (!raw) return;
    try {
        const newData = JSON.parse(raw);
        const newHash = JSON.stringify(newData);
        if (newHash !== oldHash) {
            configCache = newData;
            if (configCache.capturableCreatures) {
                configCache._capturableSet = new Set(Object.keys(configCache.capturableCreatures));
            } else {
                configCache._capturableSet = new Set();
            }
            logger.info(`配置文件已热更新，可捕捉生物数量：${configCache._capturableSet.size}`);
        }
    } catch (e) {
        logger.error(`热重载配置文件失败: ${e}`);
    }
}

function getConfig(key) {
    if (!configCache) loadConfig();
    return configCache[key];
}

function isCapturable(entityType) {
    if (!configCache) loadConfig();
    return configCache._capturableSet.has(entityType);
}

function getCapturableDisplayName(entityType) {
    if (!configCache) return entityType;
    return configCache.capturableCreatures[entityType] || entityType;
}

// ==================== 日志系统 ====================
function getTodayLogPath(type) {
    const dateStr = system.getTimeStr().substr(0, 10);
    switch (type) {
        case "release": return `./logs/${PLUGIN_NAME}/${PLUGIN_NAME}-release/${PLUGIN_NAME}-release-${dateStr}.csv`;
        case "catch": return `./logs/${PLUGIN_NAME}/${PLUGIN_NAME}-catch/${PLUGIN_NAME}-catch-${dateStr}.csv`;
        default: return `./logs/${PLUGIN_NAME}/${PLUGIN_NAME}-${dateStr}.csv`;
    }
}

function writeLog(type, source, action, entity, pos) {
    const logPath = getTodayLogPath(type);
    if (!File.readFrom(logPath)) {
        logger.warn(`已创建今日精灵球日志：${logPath}`);
        File.writeTo(logPath, "\ufeff时间,玩家,动作,生物,坐标\n");
    }
    const timeStr = system.getTimeStr();
    File.writeLine(logPath, `${timeStr},${source},${action},${entity},${pos}`);
}

// ==================== 领地判断 ====================
function toRawPos(pos) {
    return { x: pos.x, y: pos.y, z: pos.z, dimid: pos.dimid };
}

function LandJudgmentByPlayer(player, pos) {
    if (!getConfig("globalLandJudge")) return true;

    if (ll.hasExported('ILAPI_PosGetLand')) {
        const landId = ll.imports('ILAPI_PosGetLand')(toRawPos(pos));
        if (landId !== -1) {
            const isOwner = ll.imports('ILAPI_IsLandOwner')(landId, player.xuid);
            const isOperator = ll.imports('ILAPI_IsLandOperator')(player.xuid);
            const isTrusted = ll.imports('ILAPI_IsPlayerTrusted')(landId, player.xuid);
            if (!isOwner && !isOperator && !isTrusted) return false;
        }
    }

    if (ll.hasExported('PLand_LDAPI', 'PLand_getLandAt')) {
        const landId = ll.imports('PLand_LDAPI', 'PLand_getLandAt')(pos);
        if (landId !== -1) {
            const permType = ll.imports('PLand_LDAPI', 'PLand_getPermType')(player.uuid, landId, false);
            if (permType === 3) return false;
        }
    }
    return true;
}

function LandJudgmentByDispenser(pos) {
    if (!getConfig("globalLandJudge")) return true;

    if (ll.hasExported('ILAPI_PosGetLand')) {
        const landId = ll.imports('ILAPI_PosGetLand')(toRawPos(pos));
        if (landId !== -1) return false;
    }

    if (ll.hasExported('PLand_LDAPI', 'PLand_getLandAt')) {
        const landId = ll.imports('PLand_LDAPI', 'PLand_getLandAt')(pos);
        if (landId !== -1) return false;
    }
    return true;
}

// ==================== 辅助函数 ====================
function getOffsetCoordinates(coords, side) {
    let [x, y, z] = coords;
    switch (side) {
        case 0: y -= 2; break;
        case 1: y += 1; break;
        case 2: z -= 1; break;
        case 3: z += 1; break;
        case 4: x -= 1; break;
        case 5: x += 1; break;
        default: throw new Error("无效的 side 值，必须在0~5之间。");
    }
    return [x, y, z];
}

function playSoundToPlayer(player, soundID, volume, pitch, minimumVolume, pos) {
    if (typeof player === "object") {
        const cmd = `playsound ${soundID} "${player.realName}" ${player.feetPos.x} ${player.feetPos.y + 1} ${player.feetPos.z} ${volume} ${pitch} ${minimumVolume}`;
        mc.runcmdEx(`execute in ${player.pos.dimid === 0 ? 'overworld' : player.pos.dimid === 1 ? 'nether' : 'the_end'} run ${cmd}`);
    }
}

function sendMsgToPlayer(source, msg) {
    if (typeof source === "object" && source.tell) {
        source.tell(plugin_prefix + msg);
    } else {
        mc.broadcast(plugin_prefix + msg);
    }
}

function setItemEmptyEnch(item) {
    const nbt = item.getNbt();
    if (!nbt) return false;
    let tag = nbt.getTag("tag");
    if (!tag) {
        const newTag = new NbtCompound();
        newTag.setTag("ench", new NbtList());
        nbt.setTag("tag", newTag);
        return item.setNbt(nbt);
    }
    return false;
}

// ==================== NBT 操作 ====================
function setEntitySnbtToItemNbtTag(item, snbt) {
    if (!item) return false;
    let nbt = item.getNbt();
    if (!nbt || nbt.getType() !== NBT.Compound) {
        nbt = new NbtCompound();
    }
    let tag = nbt.getTag("tag");
    if (!tag || tag.getType() !== NBT.Compound) {
        tag = new NbtCompound();
        nbt.setTag("tag", tag);
    }
    tag.setString("entitySnbt", snbt);
    return item.setNbt(nbt);
}

function getEntitySnbtInItem(item) {
    if (!item) return null;
    const nbt = item.getNbt();
    if (!nbt || nbt.getType() !== NBT.Compound) return null;
    const tag = nbt.getTag("tag");
    if (!tag || tag.getType() !== NBT.Compound) return null;
    return tag.getData("entitySnbt") || null;
}

// ==================== 生成生物（自适应版本）====================
function spawnEntityWithSNBT(entityName, pos, snbt) {
    try {
        const nbt = NBT.parseSNBT(snbt);
        if (!nbt) {
            logger.error(`spawnEntityWithSNBT: 解析SNBT失败`);
            return null;
        }

        let newNbt = modifyEntityPosition(nbt, pos.x, pos.y, pos.z);
        if (!newNbt) {
            logger.error(`spawnEntityWithSNBT: 修改位置失败`);
            return null;
        }

        const versionStr = ll.versionString() || "";
        const ver = versionStr.split("+")[0];
        const majorMinor = ver.split(".").slice(0, 2).join(".");
        const useLoadMob = (parseFloat(majorMinor) >= 0.19) || (majorMinor === "0.19.0");

        let entity = null;
        if (useLoadMob) {
            entity = mc.loadMob(newNbt, pos);
        } else {
            entity = mc.spawnMob(entityName, pos);
            if (entity) {
                entity.setNbt(newNbt);
            }
        }

        if (!entity) {
            logger.error(`spawnEntityWithSNBT: 生成实体失败`);
            return null;
        }
        return entity;
    } catch (e) {
        logger.error(`spawnEntityWithSNBT 异常: ${e.message}\n${e.stack}`);
        return null;
    }
}

function modifyEntityPosition(nbt, newX, newY, newZ) {
    if (!nbt) return null;
    const posList = nbt.getTag("Pos");
    if (!posList || posList.getType() !== NBT.List) {
        return null;
    }
    const newPos = new NbtList([
        new NbtFloat(newX),
        new NbtFloat(newY),
        new NbtFloat(newZ)
    ]);
    nbt.setTag("Pos", newPos);
    return nbt;
}

// ==================== 释放生物 (onUseItemOn) ====================
let lastTriggerTime = 0;
const debounceTime = 200;

mc.listen("onUseItemOn", (player, item, block, side, pos) => {
    try {
        if (item.isNull() || item.type !== normalItem || item.lore.length < 9) return;
        if (filterList.includes(item.type)) return;
        if (block.hasContainer() || block.isButtonBlock || block.isDoorBlock ||
            block.isThinFenceBlock || block.isFenceGateBlock || block.isFenceBlock ||
            block.type.endsWith("_trapdoor")) return;

        const now = Date.now();
        if (now - lastTriggerTime < debounceTime) return;
        lastTriggerTime = now;

        const config = configCache;
        if (config.releaseEntityIsNeedPlayerIsSneaking && !player.isSneaking) {
            player.tell(plugin_prefix + `§c只有当您潜行时才能释放生物!`);
            return;
        }
        if (config.releaseEntityNeedsLandPerm && !LandJudgmentByPlayer(player, player.blockPos)) {
            player.tell(plugin_prefix + `§c禁止在他人领地内释放生物!`);
            return;
        }

        const snbt = getEntitySnbtInItem(item);
        if (!snbt) {
            logger.error(`释放失败: 未找到SNBT`);
            return;
        }

        const nbt = NBT.parseSNBT(snbt);
        if (!nbt) {
            logger.error(`释放失败: SNBT解析错误`);
            return;
        }

        const entityNameSpace = nbt.getData("identifier");
        if (typeof entityNameSpace !== "string") {
            logger.error(`释放失败: identifier无效`);
            return;
        }

        const [x, y, z] = getOffsetCoordinates([block.pos.x, block.pos.y, block.pos.z], side);
        const spawnPos = new FloatPos(x + 0.5, y, z + 0.5, block.pos.dimid);

        const spawned = spawnEntityWithSNBT(entityNameSpace, spawnPos, snbt);
        if (!spawned) {
            logger.error(`释放失败: 生成实体失败`);
            return;
        }

        const isVillager = villagerTypeNames.includes(spawned.type);
        const professionKey = isVillager ? spawned.getNbt().getData("PreferredProfession") : null;
        const professionPlain = isVillager ? (professionKey ? ProfessionStrTransition[professionKey] : "无职业") : "";
        const displayName = isVillager ? `${getCapturableDisplayName(spawned.type)} (职业：${professionPlain})` : getCapturableDisplayName(spawned.type);
        const healthStr = `${spawned.health} / ${spawned.maxHealth}`;

        player.tell(plugin_prefix + `§a释放成功 §7| §f${displayName} §7| §c${healthStr}`);
        logger.warn(`【释放】玩家 ${player.realName} 释放 ${displayName}(${healthStr}) 位置: ${spawnPos}`);

        writeLog("release", player.realName, "释放", `${displayName} ${healthStr}`, `${spawned.blockPos}`);

        playSoundToPlayer(player, "beacon.activate", 1, 1.5, 1, player.blockPos);
        const particlePos = new FloatPos(x + 0.5, y + 1, z + 0.5, block.pos.dimid);
        mc.spawnParticle(particlePos, "minecraft:sonic_explosion");

        if (config.consumeItem) {
            player.getHand().setNull();
        } else {
            player.getHand().set(mc.newItem(projectileItem, 1));
        }
        player.refreshItems();

    } catch (e) {
        logger.error(`onUseItemOn 异常: ${e.message}\n${e.stack}`);
    }
});

// ==================== 捕捉验证规则（用数组组织，循环执行）====================
function getProjectileOwner(projectile) {
    const nbt = projectile.getNbt();
    if (!nbt) return null;
    const ownerId = nbt.getData("OwnerNew")?.toString();
    if (!ownerId || ownerId === "-1") return "dispenser";
    const player = mc.getPlayer(ownerId);
    return player || null;
}

function spawnOrReturnFailed(owner, entity) {
    if (!entity || entity.type === "minecraft:breeze") return;
    const item = mc.newItem(projectileItem, 1);
    if (item) item.setDisplayName(`${configCache.pokeBallName}\n§7(空空如也)`);
    if (typeof owner === "object" && configCache.autoReturnItem) {
        owner.giveItem(item);
    } else {
        mc.spawnItem(item, entity.pos);
    }
}

function handleCaptureFail(owner, entity, msg, playSound = true) {
    sendMsgToPlayer(owner, msg);
    if (playSound && typeof owner === "object") {
        playSoundToPlayer(owner, "random.pop2", 1, 1.5, 1, entity.blockPos);
    }
    spawnOrReturnFailed(owner, entity);
}

// ==================== 弹射物命中实体 (捕捉) ====================
mc.listen("onProjectileHitEntity", (entity, projectile) => {
    try {
        if (!projectile || projectile.type !== projectileItem) return;
        const owner = getProjectileOwner(projectile);
        if (!owner) return; // 未知所有者

        // 获取实体NBT
        const entityNbt = entity.getNbt();
        if (!entityNbt) {
            logger.error(`捕捉失败: 无法获取实体NBT`);
            return;
        }

        // 预计算一些公共变量
        const displayName = getCapturableDisplayName(entity.type);
        const isOwnerPlayer = typeof owner === "object";
        const ownerUniqueId = isOwnerPlayer ? owner.uniqueId : null;
        const isOwnerSelf = (entityNbt.getData("OwnerNew")?.toString() === ownerUniqueId);

        // 定义验证规则列表（顺序执行，遇失败则终止）
        const rules = [
            {
                test: () => !entity.isPlayer() && !entity.isItemEntity(),
                failMsg: "§c玩家和掉落物不可被捕捉!",
                playSound: true
            },
            {
                test: () => isCapturable(entity.type),
                failMsg: `§c该生物 <${displayName}> 被设置为不可被捕捉!`,
                playSound: true
            },
            {
                test: () => {
                    // 领地检查（玩家或发射器）
                    if (isOwnerPlayer) {
                        return LandJudgmentByPlayer(owner, entity.blockPos);
                    } else {
                        return LandJudgmentByDispenser(entity.blockPos);
                    }
                },
                failMsg: "§c不可在其他人的领地内捕捉生物!",
                playSound: true
            },
            {
                test: () => entityNbt.getData("LeasherID") === -1,
                failMsg: "§c此生物正在被栓绳控制，不可被捕捉!",
                playSound: true
            },
            {
                test: () => entity.inWorld,
                failMsg: "§c该实体不在世界中!",
                playSound: true
            },
            {
                test: () => !(getConfig("judgeEntityIsSleeping") && entity.isSleeping),
                failMsg: "§c该生物正在睡觉中!",
                playSound: true
            },
            {
                test: () => !(getConfig("judgeEntityIsTrading") && entity.isTrading),
                failMsg: "§c该生物正在交易中!",
                playSound: true
            },
            {
                test: () => {
                    if (getConfig("judgeEntityCustomName")) {
                        const customName = entityNbt.getData("CustomName");
                        // 只有 CustomName 存在且不为空字符串时，才认为该生物被命名
                        if (customName !== undefined && customName !== null && customName !== "") {
                            return isOwnerSelf;
                        }
                    }
                    return true;
                },
                failMsg: "§c该生物已被命名，请确保您是它的驯服者后再次尝试捕捉!",
                playSound: true
            },
            {
                test: () => {
                    if (getConfig("judgePlayerGameModeIsSurvival") && isOwnerPlayer) {
                        return owner.gameMode === 0;
                    }
                    return true;
                },
                failMsg: "§c您只能在生存模式下捕捉生物!",
                playSound: true
            },
            {
                test: () => {
                    if (getConfig("judgePlayerIsSneaking") && isOwnerPlayer) {
                        return owner.isSneaking;
                    }
                    return true;
                },
                failMsg: "§c您只能在潜行状态下捕捉生物!",
                playSound: true
            },
            {
                test: () => {
                    if (getConfig("judgeEntityIsTamedByPlayer")) {
                        const IsTamed = entityNbt.getData("IsTamed") || false;
                        if (IsTamed) return isOwnerSelf;
                    }
                    return true;
                },
                failMsg: "§c该生物未被您驯服，无法捕捉!",
                playSound: true
            },
            {
                test: () => {
                    const healthConfig = getConfig("judgeEntityHealthPercent");
                    if (healthConfig.enable) {
                        const threshold = healthConfig.successHealthPercent || 0.9;
                        if ((entity.health / entity.maxHealth) > threshold) {
                            return isOwnerSelf; // 驯服者自己可以无视血量限制
                        }
                    }
                    return true;
                },
                failMsg: () => {
                    const threshold = getConfig("judgeEntityHealthPercent").successHealthPercent || 0.9;
                    const need = Math.floor(threshold * entity.maxHealth);
                    return `§c该生物的生命值需要在§a${need}§c以下才能被捕捉！`;
                },
                playSound: true
            }
        ];

        // 执行规则验证
        for (const rule of rules) {
            let passed;
            try {
                passed = rule.test();
            } catch (e) {
                logger.warn(`规则测试异常: ${e.message}`);
                passed = false;
            }
            if (!passed) {
                const msg = typeof rule.failMsg === "function" ? rule.failMsg() : rule.failMsg;
                handleCaptureFail(owner, entity, msg, rule.playSound !== false);
                return;
            }
        }

        // ========== 概率判断 ==========
        const config = configCache;
        const successPercent = isOwnerPlayer
            ? (entity.isAngry ? config.entityIsAngrySuccessPercent : config.playerNormalSuccessPercent)
            : config.dispenserNormalSuccessPercent;

        if (Math.random() > successPercent) {
            // 捕捉失败
            if (isOwnerPlayer && !isOwnerSelf) {
                playSoundToPlayer(owner, "random.pop2", 1, 1.5, 1, entity.blockPos);
            }
            if (Math.random() < config.damageRate) {
                sendMsgToPlayer(owner, `§f${displayName}§c的挣扎破坏了精灵球`);
                if (entity.type === "minecraft:breeze") projectile.despawn();
            } else {
                sendMsgToPlayer(owner, `§f${displayName}§c巧妙地躲过了精灵球`);
                spawnOrReturnFailed(owner, entity);
            }
            return;
        }

        // ========== 捕捉成功 ==========
        if (entity.type === "minecraft:breeze") projectile.despawn();

        // 构建精灵球物品
        const item = mc.newItem(normalItem, 1);
        setItemEmptyEnch(item);

        const IsTamed = entityNbt.getData("IsTamed") || false;
        const saddled = entityNbt.getData("Saddled") ? "是" : "否";
        const isAdult = !entity.isBaby ? "是" : "否";

        const professionKey = villagerTypeNames.includes(entity.type) ? entityNbt.getData("PreferredProfession") : null;
        const professionPlain = professionKey ? ProfessionStrTransition[professionKey] : "无职业";
        const professionTag = villagerTypeNames.includes(entity.type) ? `\n§a(职业：${professionPlain})§f` : "";

        const typeStr = isOwnerPlayer ? "player" : "dispenser";
        const sourceName = isOwnerPlayer ? owner.realName : `发射器(${entity.blockPos})`;

        item.setDisplayName(`${config.pokeBallName}\n§f(${displayName})§a血量：§e${entity.health} / ${entity.maxHealth}${professionTag}`);

        const ownerName = (entityNbt.getData("OwnerNew")?.toString() !== "-1")
            ? (mc.getPlayer(entityNbt.getData("OwnerNew"))?.realName || "无主人")
            : "无主人";

        const lore = [
            `${entity.uniqueId}`,
            `§r§b捕获类型：§d${typeStr}`,
            `§r§b类型：§e${displayName}`,
            `§r§b血量：§e${entity.health} / ${entity.maxHealth}`,
            `§r§b已驯服：§e${IsTamed ? "是" : "否"}`,
            `§r§b驯服人：§e${ownerName}`,
            `§r§b鞍：§e${saddled}`,
            `§r§b已成年：§e${isAdult}`,
            `§r§b捕获时间：§e${system.getTimeStr()}`,
            `§r§b捕获者：§e${sourceName}`
        ];
        const targetId = entityNbt.getData("TargetID");
        if (targetId && targetId !== -1) {
            const targetPlayer = mc.getPlayer(targetId.toString());
            if (targetPlayer) lore.push(`§r§b仇恨指向：§c${targetPlayer.realName}`);
        }
        item.setLore(lore);
        setEntitySnbtToItemNbtTag(item, entityNbt.toSNBT(4));

        // 返回物品
        if (config.autoReturnItem && isOwnerPlayer) {
            owner.giveItem(item);
        } else {
            mc.spawnItem(item, entity.pos);
        }

        // 广播和日志
        const professionDisplay = villagerTypeNames.includes(entity.type) ? `(职业：${professionPlain})` : "";
        const health = `${entity.health} / ${entity.maxHealth}`;
        mc.broadcast(plugin_prefix + `§6${sourceName} §f捕获了 §a${displayName} §7${professionDisplay} §7| (§e血量: §c${health})`);
        logger.warn(`【${typeStr === "player" ? "玩家捕捉" : "发射器捕捉"}】${sourceName} 捕获 ${displayName} ${professionDisplay} (血量${health}) 位置: ${entity.blockPos}`);
        writeLog("catch", sourceName, "捕捉", `${displayName} ${professionDisplay} (血量${health})`, `${entity.blockPos}`);

        if (isOwnerPlayer) {
            playSoundToPlayer(owner, "random.bowhit", 1, 1.5, 1, entity.blockPos);
            playSoundToPlayer(owner, "ambient.weather.lightning.impact", 1, 1.5, 1, entity.blockPos);
            owner.refreshItems();
        }
        mc.spawnParticle(new FloatPos(entity.pos.x + 0.5, entity.pos.y + 1, entity.pos.z + 0.5, entity.pos.dimid), "minecraft:wind_explosion_emitter");

        entity.despawn();

    } catch (e) {
        logger.error(`onProjectileHitEntity 异常: ${e.message}\n${e.stack}`);
    }
});

// ==================== 弹射物命中方块 (空大) ====================
mc.listen("onProjectileHitBlock", (block, projectile) => {
    try {
        if (!projectile || projectile.type !== projectileItem) return;
        const nbt = projectile.getNbt();
        if (!nbt) return;
        const ownerId = nbt.getData("OwnerNew")?.toString() || "-1";

        const item = mc.newItem(projectileItem, 1);
        if (item) item.setDisplayName(`${configCache.pokeBallName}\n§7(空空如也)`);

        if (ownerId !== "-1") {
            const player = mc.getPlayer(ownerId);
            if (player) {
                if (configCache.autoReturnItemWhenTargetEmpty) {
                    player.giveItem(item);
                } else {
                    mc.spawnItem(item, block.pos);
                }
                player.tell(plugin_prefix + `您空大了，落点：${block.pos}`);
                playSoundToPlayer(player, "random.pop", 1, 1.5, 1);
            } else {
                mc.spawnItem(item, block.pos);
            }
        } else {
            mc.spawnItem(item, block.pos);
        }
    } catch (e) {
        logger.error(`onProjectileHitBlock 异常: ${e.message}\n${e.stack}`);
    }
});

// ==================== 命令注册 ====================
mc.listen("onServerStarted", () => {
    loadConfig();
    // 每10秒检查配置更新
    configReloadInterval = setInterval(reloadConfig, 10000);

    const cmd = mc.newCommand(`poke`, `查询可捕捉的生物列表`, PermType.Any);
    cmd.overload([]);
    cmd.setCallback((cmd, ori, out, res) => {
        const player = ori.player;
        const list = configCache.capturableCreatures;
        const entries = Object.entries(list);
        let originalCount = 0, addonCount = 0;
        const lines = [];
        for (const [id, name] of entries) {
            if (id.startsWith("minecraft:")) {
                lines.push(`§a原版：§e${name} §7(${id})`);
                originalCount++;
            } else {
                lines.push(`§dAddOn：§b${name} §7(${id})`);
                addonCount++;
            }
        }
        const msg = `精灵球-可捕捉的生物列表\n共 ${entries.length} 种，包含原版生物 ${originalCount} 种，addon生物 ${addonCount} 种\n${lines.join("\n")}`;
        if (!player) {
            out.success(msg);
        } else {
            const form = mc.newCustomForm();
            form.setTitle(`精灵球-可捕捉的生物列表`);
            form.addLabel(msg);
            player.sendForm(form, () => { });
        }
    });
    cmd.setup();
});

// ==================== 插件卸载清理 ====================
ll.onUnload(() => {
    if (configReloadInterval) {
        clearInterval(configReloadInterval);
        configReloadInterval = null;
    }
    logger.info(`${PLUGIN_NAME} 已卸载，定时器已清理`);
});