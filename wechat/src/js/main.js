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


const SCREEN_WIDTH = device.getScreenWidth();
const SCREEN_HEIGHT = device.getScreenHeight();

function main() {
    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    logd("开始执行脚本...")
    launch("com.tencent.mm", 6000)
    let praiseCount = readConfigInt("praise_count");
    logd("点赞个数 ： " + praiseCount);

    timeline(praiseCount);
    exit();
}

function timeline(praiseCount) {
    logd("点赞任务 1 ： " + praiseCount);
    if (!praiseCount) {
        praiseCount = 88;
    }
    logd("点赞任务 2 ： " + praiseCount);

    // 打开发现tab
    let discoverySelector = text("发现").id("com.tencent.mm:id/f30").clz("android.widget.TextView");
    let discoveryNode = discoverySelector.getOneNodeInfo(100);
    if (discoveryNode) {
        discoveryNode.click();
        sleep(2000);
    }
    // 打开朋友圈activity
    let timelineSelector = text("朋友圈").id("android:id/title").clz("android.widget.TextView");
    let timelineNode = timelineSelector.getOneNodeInfo(100);
    if (timelineNode) {
        timelineNode.click();
        sleep(2000);
    }

    //读取点赞icon
    let praiseIcon = readResAutoImage("praise.png");
    logi("读取点赞icon结果 1：" + JSON.stringify(praiseIcon));

    // 点赞
    let count = 0;
    while (count < praiseCount) {
        // 打开点赞窗口，找到点赞评论入口，点击，找不到，向下滑。
        let praisePopSelector = id("com.tencent.mm:id/ng").desc("评论").clz("android.widget.ImageView");
        let praisePopNodes = praisePopSelector.getNodeInfo(1000);
        logd("praisePopNodes : " + JSON.stringify(praisePopNodes));
        //找到pop入口
        if (praisePopNodes && praisePopNodes.length > 0) {
            logi("praisePopNodes pop入口数组长度: " + praisePopNodes.length);
            for (let i = 0; i < praisePopNodes.length; i++) {
                //如果pop入口，Y轴坐标太小、太大则跳过，否则会误触拍照icon
                if (praisePopNodes[i].bounds.top > SCREEN_HEIGHT / 6 && praisePopNodes[i].bounds.bottom < SCREEN_HEIGHT / 6 * 5) {
                    // 打开点赞、评论pop。
                    praisePopNodes[i].click();
                    sleep(2000);

                    // 申请截图权限
                    let request = false;
                    for (let i = 0; i < 6; i++) {
                        request = image.requestScreenCapture(10000, 0);
                        sleep(1000);
                        if (request) {
                            break;
                        }
                    }
                    logi("申请截图权限，结果：" + request);
                    if (!request) {
                        loge("尝试6次，截图权限获取失败，程序结束");
                        exit();
                        return;
                    }

                    sleep(1000);


                    logi("读取点赞icon结果 2：" + JSON.stringify(praiseIcon));


                    //找点赞容器LinearLayout，找图，看是否需要点赞，找不到点赞容器todo
                    //let points = image.findImageEx(praiseIcon, praiseNode.bounds.left, praiseNode.bounds.top, praiseNode.bounds.right, praiseNode.bounds.bottom, 0.7, 0.9, 1, 5);
                    let points = image.findImageEx(praiseIcon, 0, 0, 0, 0, 0.7, 0.9, 1, 5);
                    //这玩意是个数组
                    logd("points ： " + JSON.stringify(points));
                    if (points && points.length > 0) {
                        clickPoint((points[0].left + points[0].right) / 2, (points[0].top + points[0].bottom) / 2);
                        count++;
                        logd("点赞成功，当前进度 ： " + count + " / " + praiseCount);
                    }
                }
            }
            swipeAndSleep("数组中的pop入口全部点完，上滑！！！")
        } else {
            swipeAndSleep("找不到pop入口 数组，上滑 ！！！")
        }
    }
}

function swipeAndSleep(reason) {
    swipeToPoint(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3 * 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3, 500);
    if (reason) {
        logd("swipeAndSleep ： " + reason);
    }
    sleep(2000);
}

function autoServiceStart(time) {
    for (let i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        let started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}


function launch(packageName, delay, startNum) {
    let result = false;
    if (!delay) {
        delay = 5000;
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

main();