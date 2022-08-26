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
    let startTimestamp1 = Date.parse(new Date());
    let popIcon = readResAutoImage("pop.png");
    let startTimestamp2 = Date.parse(new Date());
    logi("读图时长 = " + (startTimestamp2 - startTimestamp1) / 1000 + " 秒");
    let startTimestamp = Date.parse(new Date());
    let count = 0;
    while (count < praiseCount && (Date.parse(new Date()) - startTimestamp) < 3 * 60 * 60 * 1000) {
        logd("timeline : 进入点赞流程 ～");
        let points = image.findImageEx(popIcon, 0, 0, 0, 0, 0.7, 0.9, 10, 5);
        if (points) {
            logd("points " + JSON.stringify(points));
        }
        if (!points || points.length > 0 || points[0].top < SCREEN_HEIGHT / 6 || points[0].bottom > SCREEN_HEIGHT / 6 * 5) {
            logi("timeline : 找不到pop入口，Y轴坐标太小、太大则滑动 1/8 屏幕，跳过 ！！！ ");
            swipeAndSleep(SCREEN_HEIGHT / 8);
        } else {
            let popClickRet = clickPoint((points[0].left + points[0].right) / 2, (points[0].top + points[0].bottom) / 2);
            logd("timeline : pop points = " + JSON.stringify(points));
            logd("timeline : popClickRet = " + popClickRet);
            sleep(1000);

            let praiseSelector = text("赞").id("com.tencent.mm:id/n4").clz("android.widget.TextView").desc("赞");
            let praiseNode = praiseSelector.getOneNodeInfo(1000);
            if (praiseNode) {
                praiseNode.click();
                count++;
                sleep(2000);
                swipeAndSleep(SCREEN_HEIGHT / 4);
            } else {
                logw("timeline : 没有找到点赞node，滑动 1/8 屏幕");
                swipeAndSleep(SCREEN_HEIGHT / 8);
            }

        }

        /**
         let tmpImage;
         for (let i = 0; i < 3; i++) {
                tmpImage = image.captureFullScreen()
                sleep(1000);
                if (tmpImage) {
                    break;
                }
            }
         if (tmpImage == null) {
                logw("timeline : 尝试3次，截图失败，滑动 1/8 屏幕，跳过 ！！！ ");
                swipeAndSleep(SCREEN_HEIGHT / 8);
            } else {
                let firstColor = "#4C4C4C-#101010";
                let multiColor = "35|8|#4C4C4C-#101010,42|-40|#4C4C4C-#101010,81|-30|#FDFDFD-#101010,32|-8|#4C4C4C-#101010,71|-29|#999999-#101010,16|-3|#FFFFFF-#101010,-5|-29|#4C4C4C-#101010,46|12|#4C4C4C-#101010,51|-34|#4C4C4C-#101010,68|-21|#4C4C4C-#101010,9|-14|#4C4C4C-#101010,13|-28|#4C4C4C-#101010,22|-29|#4C4C4C-#101010,60|7|#4C4C4C-#101010,67|5|#4C4C4C-#101010,-19|-1|#4C4C4C-#101010,-10|-22|#FFFFFF-#101010,1|8|#4C4C4C-#101010,75|-41|#4C4C4C-#101010,41|1|#4C4C4C-#101010,-13|-31|#4C4C4C-#101010,20|-11|#4C4C4C-#101010,0|7|#4C4C4C-#101010,42|-27|#4C4C4C-#101010,8|11|#4C4C4C-#101010,41|-40|#4C4C4C-#101010,-18|-16|#4C4C4C-#101010,66|8|#4C4C4C-#101010,19|6|#4C4C4C-#101010";
                let points = image.findMultiColorEx(firstColor, multiColor, 0.9, 0, 0, 0, 0, 1, 1);
                if (points && points.length > 0) {
                    logd("timeline : points " + JSON.stringify(points));
                    clickPoint(points[0].x, points[0].y);
                    count++;
                    logd("timeline : 点赞成功，进度 ： " + count + " / " + praiseCount);
                    sleep(2000);
                    swipeAndSleep(SCREEN_HEIGHT / 4);
                } else {
                    logw("timeline : 找色失败，滑动 1/8 屏幕");
                    swipeAndSleep(SCREEN_HEIGHT / 8);
                }
                //图片要回收
                image.recycle(tmpImage);
            }
         **/
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