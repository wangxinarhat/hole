const SCREEN_WIDTH = device.getScreenWidth();
const SCREEN_HEIGHT = device.getScreenHeight();

function main() {
    logd("开始执行脚本------>")
    let isPraiseParam;
    let isPraise = readConfigString("praise_timeline");
    let isMessage = readConfigString("bless_message");
    let messageContent = readConfigString("message_content");
    let praiseCount = readConfigInt("praise_count");
    logd("isPraise : " + isPraise + " ; type = " + typeof isPraise);
    logd("isMessage : " + isMessage + " ; type = " + typeof isMessage);
    logd("messageContent: " + messageContent + " ; type = " + typeof messageContent);
    logd("praiseCount: " + praiseCount + " ; type = " + typeof praiseCount);

    isPraiseParam = false;
    if (isPraiseParam) {

        // if ("ture" === readConfigString("praise_timeline")) {
        logi("是点赞 ！！！ ");
        isPraiseParam = true;
        if (praiseCount < 100 && praiseCount > 1000) {
            toast("点赞数量应该100～1000");
            return;
        }
    } else {
        logi("发消息 ！！！ ");
        isPraiseParam = false;
        // if ("" === readConfigString("message_content")) {
        //     toast("请填入消息内容～");
        //     return;
        // }
    }
    if (!commonUtils.autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        // exit();
        return;
    }
    let startRet = utils.openAppByName("微信");
    logd("启动微信结果 ： " + startRet);
    if (!startRet) {
        toast("启动微信失败，检查手机是否安装微信app");
        return;
    }
    sleep(5000);
    if (isPraiseParam) {
        timeline(praiseCount);
    } else {
        send("你好～", 10);
    }

    logd("脚本执行完毕------>");
    // exit();
}

main();