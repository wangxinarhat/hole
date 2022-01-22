function send(content) {
    logd("send ： " + content);
    if (!content || "" === content) {
        return
    }

    // 打开消息tab
    let tabSelector = text("微信").id("com.tencent.mm:id/f30").clz("android.widget.TextView");
    let tabNode = tabSelector.getOneNodeInfo(100);
    if (tabNode) {
        tabNode.click();
        sleep(2000);
    }


    // 点赞
    let count = 0;
    while (count < 100) {
        // 打开点赞窗口，找到点赞评论入口，点击，找不到，向下滑。
        let friendSelectors = id("com.tencent.mm:id/hga").clz("android.view.View");
        let friendNodes = friendSelectors.getNodeInfo(1000);

        logi("friendNodes = " + friendNodes);
        //找不到pop入口，Y轴坐标太小、太大则滑动1/6屏幕，跳过
        if (!friendNodes || friendNodes.length<1){
            logi("找不到聊天消息则滑动 1/8 屏幕！！！ ");
            swipeAndSleep(SCREEN_HEIGHT / 8);
        } else {
            for (let i = 0; i < friendNodes.length; i++) {
                logd(friendNodes[i].text);
            }




            /**

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
                logw("尝试3次，申请截图权限失败，滑动 1/8 屏幕，跳过 ！！！ ");
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
                logw("尝试3次，截图失败，滑动 1/8 屏幕，跳过 ！！！ ");
                swipeAndSleep(SCREEN_HEIGHT / 8);
            } else {
                let firstColor = "#4C4C4C-#101010";
                let multiColor = "-61|-29|#4C4C4C-#101010,-83|-47|#4C4C4C-#101010,-86|-18|#CECECE-#101010,-10|-44|#4C4C4C-#101010,-18|-30|#FFFFFF-#101010,-57|2|#4C4C4C-#101010,-56|-17|#FFFFFF-#101010,0|-43|#4C4C4C-#101010,-66|-2|#A6A6A6-#101010,-21|-28|#FFFFFF-#101010,-7|-29|#FFFFFF-#101010,-51|0|#4C4C4C-#101010,-10|-39|#4C4C4C-#101010,2|-8|#4C4C4C-#101010,-23|-30|#FFFFFF-#101010,-75|-23|#4C4C4C-#101010,-20|-33|#4C4C4C-#101010,-78|-31|#4C4C4C-#101010,-86|-7|#4C4C4C-#101010,-22|-4|#828282-#101010,-12|-13|#4C4C4C-#101010,-73|2|#4C4C4C-#101010,-50|-2|#4C4C4C-#101010,-21|-4|#4C4C4C-#101010,2|-46|#4C4C4C-#101010,-42|2|#4C4C4C-#101010,-51|-26|#FFFFFF-#101010,-45|-23|#4C4C4C-#101010,-30|-18|#4C4C4C-#101010";
                let points = image.findMultiColor(tmpImage, firstColor, multiColor, 0.9, 0, 0, 0, 0, 1, 1);
                //这玩意是个数组
                if (points && points.length > 0) {
                    logd("points " + JSON.stringify(points));
                    clickPoint(points[0].x, points[0].y);
                    count++;
                    logd("点赞成功，进度 ： " + count + " / " + praiseCount);
                    sleep(2000);
                    swipeAndSleep(SCREEN_HEIGHT / 4);
                } else {
                    logi("找色失败，滑动 1/8 屏幕");
                    swipeAndSleep(SCREEN_HEIGHT / 8);
                }
                //图片要回收
                image.recycle(tmpImage);
            }
             **/
        }
        sleep(2000);
    }
}
