function send(content, count) {
    logd("send ： " + content);
    if (!content || "" === content) {
        return
    }
    if (count < 20) {
        count = 20;
    }

    let result = agentEvent.setCurrentIme();
    if (result) {
        logi("设置输入法成功");
    } else {
        // utils.openIntentAction("android.settings.INPUT_METHOD_SETTINGS");
        //todo
        loge("设置输入法失败,请手动设置");
        return;
    }

    // 打开消息tab
    let tabSelector = text("微信").id("com.tencent.mm:id/f30").clz("android.widget.TextView");
    let tabNode = tabSelector.getOneNodeInfo(100);
    if (tabNode) {
        tabNode.click();
        sleep(2000);
    }

    //连接数据库
    connect();

    // 发消息
    let curCount = 0;
    while (curCount < count) {
        // 找聊天窗口列表，找不到滑动。
        let friendSelectors = id("com.tencent.mm:id/hga").clz("android.view.View");
        let friendNodes = friendSelectors.getNodeInfo(1000);
        //找不到pop入口，Y轴坐标太小、太大则滑动1/6屏幕，跳过
        if (!friendNodes || friendNodes.length < 1) {
            loge("找不到聊天消息则滑动 1/8 屏幕！！！ ");
            swipeAndSleep(SCREEN_HEIGHT / 8);
        } else {
            logd("获取到的聊天列表长度 ： " + friendNodes.length);
            for (let i = 0; i < friendNodes.length; i++) {
                logd("本次滑动进度 ： " + i + " / " + friendNodes.length);
                //todo 查看是否群聊，如果是，back
                logd(friendNodes[i].text);
                if (!isNeedMessage(friendNodes[i].text, content) || friendNodes[i].bounds.top < SCREEN_HEIGHT / 8 || friendNodes[i].bounds.bottom > SCREEN_HEIGHT / 8 * 7) {
                    logd(friendNodes[i].text + " 不需要发祝福消息，或者屏幕位置太高、太低～");
                    continue;
                } else {
                    friendNodes[i].click();
                    sleep(2000);
                    let inputSelector = id("com.tencent.mm:id/b4a").clz("android.widget.EditText");
                    let inputNode = inputSelector.getOneNodeInfo(1000);
                    if (inputNode) {
                        inputNode.clearText();
                        sleep(500);
                        // inputNode.imeInputText(content);
                        let poem = randomPoem();
                        inputNode.imeInputText(poem);
                        sleep(2000);
                        let sendSelector = id("com.tencent.mm:id/b8k").clz("android.widget.Button");
                        let sendNode = sendSelector.getOneNodeInfo(1000);
                        if (sendNode) {
                            sendNode.click();
                            curCount++;
                            logi("进度：" + curCount + " / " + count + " ; 给 " + friendNodes[i].text + " 发送祝福消息成功～");
                            record(friendNodes[i].text, poem);

                            sleep(2000);
                            back();
                        } else {
                            loge("找不到发送按钮～");
                            back();
                        }
                    } else {
                        loge("找不到输入框～");
                        back();
                    }
                }
                sleep(3000);
            }
            // 滑动3/4屏幕
            swipeAndSleep(SCREEN_HEIGHT / 4 * 3);
        }
        sleep(2000);
    }
    //恢复之前的输入法
    agentEvent.restoreIme()

}
