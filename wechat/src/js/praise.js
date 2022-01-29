function timeline(praiseCount) {
    logd("timeline : praiseCount = " + praiseCount);

    //恢复之前的输入法
    agentEvent.restoreIme()

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

    // 申请截图权限
    let request = false;
    for (let i = 0; i < 3; i++) {
        request = image.requestScreenCapture(10000, 0);
        sleep(2000);
        if (request) {
            break;
        }
    }
    if (!request) {
        loge("timeline : 尝试3次，申请截图权限失败，滑动 1/8 屏幕，跳过 ！！！ ");
        return
    }
    sleep(1000);

    // 点赞
    let startTimestamp = Date.parse(new Date());
    let count = 0;
    while (count < praiseCount && (Date.parse(new Date()) - startTimestamp) < 3 * 60 * 60 * 1000) {
        // 打开点赞窗口，找到点赞评论入口，点击，找不到，向下滑。
        let praisePopSelector = id("com.tencent.mm:id/ng").desc("评论").clz("android.widget.ImageView");
        let praisePopNode = praisePopSelector.getOneNodeInfo(1000);

        logi("timeline : praisePopNode = " + praisePopNode);
        //找不到pop入口，Y轴坐标太小、太大则滑动1/6屏幕，跳过
        if (!praisePopNode || praisePopNode.bounds.top < SCREEN_HEIGHT / 6 || praisePopNode.bounds.bottom > SCREEN_HEIGHT / 6 * 5) {
            logi("timeline : 找不到pop入口，Y轴坐标太小、太大则滑动 1/8 屏幕，跳过 ！！！ ");
            swipeAndSleep(SCREEN_HEIGHT / 8);
        } else {
            // 打开点赞、评论pop。
            praisePopNode.click();
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
        }
        sleep(2000);
    }
}

function swipeAndSleep(diff) {
    if (diff <= 0 || diff > SCREEN_HEIGHT / 4) {
        diff = SCREEN_HEIGHT / 4;
    }
    swipeToPoint(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 * 3, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 * 3 - diff, 500);
    sleep(2000);
}