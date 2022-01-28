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
                let multiColor = "-74|8|#4C4C4C-#101010,-47|30|#4C4C4C-#101010,-1|25|#4C4C4C-#101010,-5|23|#FFFFFF-#101010,-22|-4|#4C4C4C-#101010,-65|1|#585858-#101010,-101|40|#4C4C4C-#101010,-26|20|#FFFFFF-#101010,6|-1|#4C4C4C-#101010,-103|27|#4C4C4C-#101010,-48|42|#4C4C4C-#101010,-46|34|#4C4C4C-#101010,-42|-2|#4C4C4C-#101010,-50|6|#FFFFFF-#101010,-40|-2|#4C4C4C-#101010,-80|23|#4C4C4C-#101010,5|42|#4C4C4C-#101010,-77|-13|#4C4C4C-#101010,-96|0|#4C4C4C-#101010,-40|-4|#4C4C4C-#101010,-42|24|#4C4C4C-#101010,-26|35|#4C4C4C-#101010,-3|4|#FFFFFF-#101010,-72|23|#4C4C4C-#101010,-27|-4|#4C4C4C-#101010,-88|34|#4C4C4C-#101010,-32|-9|#4C4C4C-#101010,-43|43|#4C4C4C-#101010,-97|-4|#4C4C4C-#101010";
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