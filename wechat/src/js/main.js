const SCREEN_WIDTH = device.getScreenWidth();
const SCREEN_HEIGHT = device.getScreenHeight();

function main() {

    logd("开始执行脚本------>")
    //获取数据
    let isPraise = "true" === readConfigString("praise_timeline");
    let messageContent = readConfigString("message_content");
    let praiseCount = readConfigInt("praise_count");
    logd("main : isPraise = " + isPraise + " ; type = " + typeof isPraise);
    logd("main : messageContent = " + messageContent + " ; type = " + typeof messageContent);
    logd("main : praiseCount = " + praiseCount + " ; type = " + typeof praiseCount);

    //校验数据
    if (isPraise) {
        if (praiseCount < 88 || praiseCount > 1888) {
            toast("点赞数量应该 88～1888");
            return;
        }
    } else {
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

    if (!image.initOpenCV()) {
        toast("初始化openCV失败,停止脚本!")
        loge("初始化openCV失败,停止脚本!")
        exit()
    }
    image.releaseScreenCapture();
    sleep(2000);

    let startRet = utils.openAppByName("微信");
    logd("main : 启动微信结果 ： " + startRet);
    if (!startRet) {
        toast("main : 启动微信失败，检查手机是否安装微信app");
        return;
    }
    sleep(3000);

    //引流程序
    if (isPraise) {
        timeline(praiseCount);
    } else {
        send(messageContent, 1888);
    }

    logd("main : 脚本执行完毕------>");
    exit();
}

main();