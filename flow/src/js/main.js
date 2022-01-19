/**
 * 常用JS变量:
 * agentEvent = 代理模式下自动点击模块
 * acEvent= 无障碍模式下自动点击模块
 * device = 设备信息模块
 * file = 文件处理模块
 * http = HTTP网络请求模块
 * shell = shell命令模块
 * thread= 多线程模块
 * image = 图色查找模块
 * utils= 工具类模块
 * global = 全局快捷方式模块
 * 常用java变量：
 *  context : Android的Context对象
 *  javaLoader : java的类加载器对象
 * 导入Java类或者包：
 *  importClass(类名) = 导入java类
 *      例如: importClass(java.io.File) 导入java的 File 类
 *  importPackage(包名) =导入java包名下的所有类
 *      例如: importPackage(java.util) 导入java.util下的类
 *
 */

function main() {
    if (!autoServiceStart(3)) {
        loge("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }

    ui.logd("无障碍模式: " + ui.isAccMode());
    ui.logd("代理模式: " + ui.isAgentMode());

    launch("com.dianping.v1", 3000, 3);
    //1 选择城市


    //2 进入美食频道
    enterFoodChannel()


    //3 打开筛选窗口
    let selectorsFilter = desc("FilterButtonTitle").clz("android.widget.TextView");
    let nodesFilter = selectorsFilter.getNodeInfo(5000);
    logd("筛选条件: " + JSON.stringify(nodesFilter));
    if (nodesFilter) {
        logd("筛选条件 length: " + nodesFilter.length);
        let restlt = nodesFilter[0].click();
        logd("筛选点击结果 : " + restlt);
        logd("屏幕宽度 / 4 : " + device.getScreenWidth() / 4);
        logd("筛选条件: " + JSON.stringify(nodesFilter[0]));
        // for (let i = 0; i < nodesFilter.length; i++) {
        //     if (nodesFilter[i].left < device.getScreenWidth() / 4) {
        //         nodesFilter[i].click();
        //         break;
        //     }
        // }
    }

    //4 选择区



}

function enterFoodChannel() {
    let selector = desc("美食").id("com.dianping.v1:id/nearby").clz("android.widget.RelativeLayout");
    let node = selector.getOneNodeInfo(2000);
    if (node) {
        let result = node.click();
        logd("是否进入美食频道: " + result);
    }
    sleep(2000);
}


function launch(packageName, delay, startNum) {
    let result = false;
    if (!delay) {
        delay = 3000;
    }
    if (!startNum) {
        startNum = 3;
    }
    if (utils.isAppExist(packageName)) {
        if (getRunningPkg() === packageName) {
            logd('应用已经在前台');
            result = true;
        } else {
            logd('启动应用...');

            let selectors = text('允许');
            let num = 0;
            while (num < startNum) {
                if (getRunningPkg() === packageName) {
                    logi('启动成功');
                    result = true;
                    break;
                } else if (has(selectors)) {
                    let node = selectors.getOneNodeInfo(1000);
                    if (node) {
                        node.click()
                    }
                } else {
                    utils.openApp(packageName);
                    sleep(delay);
                    num++;
                }
            }
        }
    } else {
        loge('应用未安装');
    }
    if (result) {
        logd('应用版本号：' + utils.getAppVersionName(packageName));
    }
    return result;
};

function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

main();