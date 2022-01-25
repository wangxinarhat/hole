function send(content, count) {
    logd("send ： count =" + count);
    if (!content || "" === content) {
        return
    }
    if (count < 20) {
        count = 20;
    }
    let result = agentEvent.setCurrentIme();
    if (result) {
        logi("send ：设置输入法成功");
    } else {
        // utils.openIntentAction("android.settings.INPUT_METHOD_SETTINGS");
        //todo
        loge("send ：设置输入法失败,请手动设置");
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
        let friendSelectors = id("com.tencent.mm:id/hga").clz("android.view.View");
        let friendNodes = friendSelectors.getNodeInfo(1000);
        // 找聊天窗口列表，找不到滑动。
        if (!friendNodes || friendNodes.length < 1) {
            loge("send : 找不到聊天消息则滑动 1/10 屏幕！！！ ");
            swipeAndSleep(SCREEN_HEIGHT / 10);
        } else {
            for (let i = 0; i < friendNodes.length; i++) {
                logd("send : 屏幕内发消息进度 = " + i + " / " + friendNodes.length);
                //todo 查看是否群聊，如果是，back
                logd("send : nickname = " + friendNodes[i].text);
                let messageContent = friendNodes[i].text.concat(content);
                if (friendNodes[i].bounds.top < SCREEN_HEIGHT / 8 || friendNodes[i].bounds.bottom > SCREEN_HEIGHT / 8 * 7) {
                    logi("send : nickname = " + friendNodes[i].text + " 屏幕位置太高或者太低，跳过～");
                    continue;
                } else if (isInBlacklist(friendNodes[i].text)) {
                    logi("send : nickname = " + friendNodes[i].text + " 在黑名单中，跳过～");
                    continue;
                } else if (!isNeedMessage(friendNodes[i].text, messageContent)) {
                    logi("send : nickname = " + friendNodes[i].text + " 已经发送过，今天不要再打扰～");
                    continue;
                } else {
                    friendNodes[i].click();
                    sleep(2000);
                    let inputSelector = id("com.tencent.mm:id/b4a").clz("android.widget.EditText");
                    let inputNode = inputSelector.getOneNodeInfo(1000);
                    if (inputNode) {
                        inputNode.clearText();
                        sleep(500);
                        //let inputText = friendNodes[i].text.concat("您好，感谢您过去对豆壳餐厅的支持～\n\n新春佳节将至，祝愿您在新的一年里，\n所有的希望都能如愿，\n所有的梦想都能实现，\n所有的等候都能出现，\n所有的付出都能兑现!");
                        inputNode.imeInputText(messageContent);
                        sleep(2000);
                        let sendSelector = id("com.tencent.mm:id/b8k").clz("android.widget.Button");
                        let sendNode = sendSelector.getOneNodeInfo(1000);
                        if (sendNode) {
                            sendNode.click();
                            curCount++;
                            logi("send : 当前总进度 = " + curCount + " / " + count);
                            record(friendNodes[i].text, messageContent);
                            sleep(2000);
                            back();
                        } else {
                            loge("send : 找不到发送按钮～");
                            back();
                        }
                    } else {
                        loge("send : 找不到输入框～");
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
