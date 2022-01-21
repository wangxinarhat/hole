const SCREEN_WIDTH = device.getScreenWidth();
const SCREEN_HEIGHT = device.getScreenHeight();

function main() {
    if (!commonUtils.autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }


    logd("praise : " + readConfigString("praise_timeline"));
    logd("message : " + readConfigString("bless_message"));
    logd("content: " + readConfigString("message_content"));


    logd("开始执行脚本------>")
    utils.openAppByName("微信");
    sleep(5000);
    let praiseCount = readConfigInt("praise_count");
    logd("点赞个数 ： " + praiseCount);
    timeline(praiseCount);
    logd("脚本执行完毕------>")
    exit();
}

main();