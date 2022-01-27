const SCREEN_WIDTH = device.getScreenWidth();
const SCREEN_HEIGHT = device.getScreenHeight();

function main() {

    logd("开始执行脚本------>")
    //获取数据
    let isPraise = readConfigString("praise_timeline");
    let messageContent = readConfigString("message_content");
    let praiseCount = readConfigInt("praise_count");
    logd("main : isPraise = " + isPraise + " ; type = " + typeof isPraise);
    logd("main : messageContent = " + messageContent + " ; type = " + typeof messageContent);
    logd("main : praiseCount = " + praiseCount + " ; type = " + typeof praiseCount);

    //校验数据
    if ("true" === isPraise) {
        logi("main : 是点赞 ！！！ ");
        if (praiseCount < 68 || praiseCount > 188) {
            toast("点赞数量应该 68～188");
            return;
        }
    } else {
        logi("main : 发消息 ！！！ ");
        if ("" === readConfigString("message_content")) {
            toast("请填入祝福内容～");
            return;
        }
    }

    //启动服务，启动app
    if (!commonUtils.autoServiceStart(3)) {
        logd("main : 自动化服务启动失败，无法执行脚本")
        // exit();
        return;
    }
    let startRet = utils.openAppByName("微信");
    logd("main : 启动微信结果 ： " + startRet);
    if (!startRet) {
        toast("main : 启动微信失败，检查手机是否安装微信app");
        return;
    }
    sleep(5000);

    //引流程序
    if ("true" === isPraise) {
        timeline(praiseCount);
    } else {
        send(messageContent, 188);
    }

    logd("main : 脚本执行完毕------>");

    exit();
}

main();