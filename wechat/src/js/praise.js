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

    // 点赞
    let startTimestamp = Date.parse(new Date());
    let count = 0;
    while (count < praiseCount && (Date.parse(new Date()) - startTimestamp) < 2 * 60 * 60 * 1000) {
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

            // 申请截图权限
            let request = false;
            for (let i = 0; i < 3; i++) {
                request = image.requestScreenCapture(10000, 0);
                sleep(1000);
                if (request) {
                    break;
                }
            }
            if (!request) {
                logw("timeline : 尝试3次，申请截图权限失败，滑动 1/8 屏幕，跳过 ！！！ ");
                swipeAndSleep(SCREEN_HEIGHT / 8);
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
                logw("timeline : 尝试3次，截图失败，滑动 1/8 屏幕，跳过 ！！！ ");
                swipeAndSleep(SCREEN_HEIGHT / 8);
            } else {
                let firstColor = "#4C4C4C-#101010";
                let multiColor = "-61|-29|#4C4C4C-#101010,-83|-47|#4C4C4C-#101010,-86|-18|#CECECE-#101010,-10|-44|#4C4C4C-#101010,-18|-30|#FFFFFF-#101010,-57|2|#4C4C4C-#101010,-56|-17|#FFFFFF-#101010,0|-43|#4C4C4C-#101010,-66|-2|#A6A6A6-#101010,-21|-28|#FFFFFF-#101010,-7|-29|#FFFFFF-#101010,-51|0|#4C4C4C-#101010,-10|-39|#4C4C4C-#101010,2|-8|#4C4C4C-#101010,-23|-30|#FFFFFF-#101010,-75|-23|#4C4C4C-#101010,-20|-33|#4C4C4C-#101010,-78|-31|#4C4C4C-#101010,-86|-7|#4C4C4C-#101010,-22|-4|#828282-#101010,-12|-13|#4C4C4C-#101010,-73|2|#4C4C4C-#101010,-50|-2|#4C4C4C-#101010,-21|-4|#4C4C4C-#101010,2|-46|#4C4C4C-#101010,-42|2|#4C4C4C-#101010,-51|-26|#FFFFFF-#101010,-45|-23|#4C4C4C-#101010,-30|-18|#4C4C4C-#101010";
                let points = image.findMultiColor(tmpImage, firstColor, multiColor, 0.9, 0, 0, 0, 0, 1, 1);
                //这玩意是个数组
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