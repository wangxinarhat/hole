const SCREEN_WIDTH = device.getScreenWidth();
const SCREEN_HEIGHT = device.getScreenHeight();

function main() {
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    logd("开始执行脚本------>")
    utils.openAppByName("微信");
    sleep(5000);
    let praiseCount = readConfigInt("praise_count");
    logd("点赞个数 ： " + praiseCount);
    timeline(praiseCount);
    logd("脚本执行完毕------>")
    exit();
}

function timeline(praiseCount) {
    logd("点赞任务 ： " + praiseCount);
    if (!praiseCount) {
        praiseCount = 88;
    }

    // 打开发现tab
    let discoverySelector = text("发现").id("com.tencent.mm:id/f30").clz("android.widget.TextView");
    let discoveryNode = discoverySelector.getOneNodeInfo(100);
    if (discoveryNode) {
        discoveryNode.click();
        sleep(2000);
    }
    logd("打开发现tab");

    // 打开朋友圈activity
    let timelineSelector = text("朋友圈").id("android:id/title").clz("android.widget.TextView");
    let timelineNode = timelineSelector.getOneNodeInfo(100);
    if (timelineNode) {
        timelineNode.click();
        sleep(2000);
    }
    logd("打开朋友圈activity ");

    // 点赞
    let count = 0;
    while (count < praiseCount) {
        // 打开点赞窗口，找到点赞评论入口，点击，找不到，向下滑。
        let praisePopSelector = id("com.tencent.mm:id/ng").desc("评论").clz("android.widget.ImageView");
        let praisePopNode = praisePopSelector.getOneNodeInfo(1000);
        logd("pop入口 praisePopNode : " + praisePopNode);
        //找不到pop入口
        if (!praisePopNode) {
            loge("找不到pop入口，上滑 ！！！ ");
            swipeAndSleep();
            continue;
        }
        //如果pop入口，Y轴坐标太小、太大则跳过，否则会误触拍照icon
        if (praisePopNode.bounds.top > SCREEN_HEIGHT / 6 && praisePopNode.bounds.bottom < SCREEN_HEIGHT / 6 * 5) {
            // 打开点赞、评论pop。
            praisePopNode.click();
            sleep(1000);

            // 申请截图权限
            let request = false;
            for (let i = 0; i < 3; i++) {
                request = image.requestScreenCapture(10000, 0);
                sleep(1000);
                if (request) {
                    break;
                }
            }
            logi("申请截图权限，结果：" + request);
            if (!request) {
                loge("尝试3次，截图权限获取失败，滑动后重试！！！");
                continue;
            }
            sleep(1000);

            let tmpImage;
            for (let i = 0; i < 3; i++) {
                tmpImage = image.captureFullScreen()
                sleep(1000);
                if (tmpImage) {
                    break;
                }
            }
            if (tmpImage == null) {
                loge("尝试3次，截图失败，滑动后重试！！！");
                continue;
            } else {
                let firstColor = "#4C4C4C-#101010";
                let multiColor = "-42|-36|#DDDDDD-#101010,-99|-47|#4C4C4C-#101010,-114|-56|#4C4C4C-#101010,-114|2|#4C4C4C-#101010,-46|-29|#AAAAAA-#101010,-36|5|#4C4C4C-#101010,-5|1|#4C4C4C-#101010,-52|-9|#4C4C4C-#101010,-8|3|#4C4C4C-#101010,-49|-5|#4D4D4D-#101010,-81|-46|#4C4C4C-#101010,-24|0|#4C4C4C-#101010,-13|-40|#4C4C4C-#101010,-119|-22|#4C4C4C-#101010,-124|-5|#4C4C4C-#101010,-25|-33|#FFFFFF-#101010,-123|0|#4C4C4C-#101010,-49|-26|#4C4C4C-#101010,-15|-20|#4C4C4C-#101010,-83|19|#4C4C4C-#101010,-88|-1|#A6A6A6-#101010,-58|-1|#4C4C4C-#101010,-2|-43|#4C4C4C-#101010,-34|-36|#ABABAB-#101010,-14|-24|#4C4C4C-#101010,-72|-45|#4C4C4C-#101010,-24|-2|#4C4C4C-#101010,-75|-57|#4C4C4C-#101010,-53|-28|#4C4C4C-#101010";
                let points = image.findMultiColor(tmpImage, firstColor, multiColor, 0.9, 0, 0, 0, 0, 1, 1);
                //这玩意是个数组
                logd("points " + points);
                if (points && points.length > 0) {
                    logd("points " + JSON.stringify(points));
                    clickPoint(points[0].x, points[0].y);
                    count++;
                    logd("点赞成功，当前进度 ： " + count + " / " + praiseCount);
                    sleep(2000);
                } else {
                    loge("点赞找色失败 points = " + points);
                }
                //图片要回收
                image.recycle(tmpImage);
            }
        }
        logi("点赞结束，上滑 ！！！");
        swipeAndSleep();
    }
}

function swipeAndSleep() {
    swipeToPoint(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 * 3, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 500);
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

main();