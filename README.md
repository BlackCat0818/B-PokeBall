# LSE B-PokeBall Add-on

基岩版BDS服务器的精灵球插件，适配LSE（legacy-script-engine-quickjs）环境，修复了原版Addon的多个缺陷

## 安装

### 前置要求
- [LeviLamina](https://github.com/LiteLDev/LeviLamina) BDS框架
- [legacy-script-engine-quickjs](https://github.com/LiteLDev/LegacyScriptEngine) 插件
- 基岩版服务端版本 >= 1.21.90

### 安装步骤
1. 将行为包和资源包放入世界的`behavior_packs`和`resource_packs`文件夹
2. 将LSE脚本放入BDS服务器的`plugins`目录

## 使用说明

### 必要配置
```properties
# 将以下标识加入扫地机插件白名单：
- 精灵球普通物品: `ed:ball_1`
- 精灵球可投掷物品: `ed:ball_1`

