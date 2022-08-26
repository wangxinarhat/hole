function timeline(praiseCount) {
    logd("timeline : praiseCount = " + praiseCount);
    //恢复之前的输入法
    agentEvent.restoreIme()

    // 打开发现tab
    let discoverySelector = text("发现").id("com.tencent.mm:id/f2s").clz("android.widget.TextView");
    let discoveryNode = discoverySelector.getOneNodeInfo(100);
    logd("timeline : discoveryNode = " + discoveryNode);
    if (discoveryNode) {
        discoveryNode.click();
        sleep(2000);
    }

    // 打开朋友圈activity
    let timelineSelector = text("朋友圈").id("android:id/title").clz("android.widget.TextView");
    let timelineNode = timelineSelector.getOneNodeInfo(100);
    logd("timeline : timelineNode = " + timelineNode);
    if (timelineNode) {
        let timelineRet = timelineNode.click();
        logd("timeline : timelineRet = " + timelineRet);
        sleep(2000);
    }

    // 申请截图权限
    let request = false;
    for (let i = 0; i < 3; i++) {
        request = image.requestScreenCapture(10000, 0);
        sleep(2000);
        if (request) {
            break;
        }
    }
    logd("timeline : 申请截图权限结果 request = " + request);

    if (!request) {
        loge("timeline : 尝试3次，申请截图权限失败，滑动 1/8 屏幕，跳过 ！！！ ");
        return
    }
    sleep(1000);
    let popIcon = readResAutoImage("pop.png");
    let startTimestamp = Date.parse(new Date());
    let count = 0;
    while (count < praiseCount && (Date.parse(new Date()) - startTimestamp) < 3 * 60 * 60 * 1000) {
        logd("timeline : 点赞进度 = " + count + "/" + praiseCount);
        let points = image.findImageEx(popIcon, 0, 0, 0, 0, 0.7, 0.9, 10, 5);
        if (points) {
            logd("timeline : pop points length = " + points.length);
            logd("timeline : pop points = " + JSON.stringify(points));
        }
        if (!points || points.length === 0 || points[0].top < SCREEN_HEIGHT / 6 || points[0].bottom > SCREEN_HEIGHT / 6 * 5) {
            logi("timeline : 找不到pop入口，Y轴坐标太小、太大则滑动 1/8 屏幕，跳过 ！！！ ");
            swipeAndSleep(SCREEN_HEIGHT / 8);
        } else {
            let popClickRet = clickPoint((points[0].left + points[0].right) / 2, (points[0].top + points[0].bottom) / 2);
            logd("timeline : popClickRet = " + popClickRet);
            sleep(1000);
            let praiseSelector = text("赞").id("com.tencent.mm:id/n4").clz("android.widget.TextView").desc("赞");
            let praiseNode = praiseSelector.getOneNodeInfo(1000);
            if (praiseNode) {
                praiseNode.click();
                count++;
                logi("timeline : 点赞成功，滑动 1/4 屏幕");
                sleep(2000);
                swipeAndSleep(SCREEN_HEIGHT / 4);
            } else {
                logi("timeline : 没有找到点赞node，滑动 1/4 屏幕");
                swipeAndSleep(SCREEN_HEIGHT / 4);
            }

        }
    }
    image.recycle(popIcon)
    sleep(2000);
}

function swipeAndSleep(diff) {
    if (diff <= 0 || diff > SCREEN_HEIGHT / 4) {
        diff = SCREEN_HEIGHT / 4;
    }
    swipeToPoint(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 * 3, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 * 3 - diff, 500);
    sleep(2000);
}