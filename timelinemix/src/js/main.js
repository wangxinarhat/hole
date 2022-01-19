function main() {
    //开始再这里编写代码了！！
    toast("Hello World");
    var name = readConfigString("name");
    logd("姓名: " + name);
    logd("年龄: " + readConfigString("age"));
    logd("听音乐: " + readConfigString("music"));
    logd("是不是一年级: " + readConfigString("one"));
    logd("备注: " + readConfigString("mark"));
    //如果自动化服务正常
    if (!autoServiceStart(3)) {
        logd("自动化服务启动失败，无法执行脚本")
        exit();
        return;
    }
    
    logd("开始执行脚本...")
    //这里进行载入插件操作
    var r = loadDex("defaultplugin.apk");
    if (!r) {
        loge("载入插件失败");
        return;
    } else {
        logd("载入插件成功");
    }

    //=======下面是演示js调用java的功能=========
    //这里实例化对象，然后进行调用相关的方法
    var obj = new com.plugin.AxrNAVUFVC.PluginClz(context);
    var s=obj.test();
    logd("java 返回数据: "+s);
    var s = obj.test();
    logd("java 返回数据: " + s);


    //=======下面是演示java调用js的功能=========
    // 暴露一个类给java调用，对应到java代码的EcFun类
    let EcFun = function () {

    }
    //实现logd2函数
    EcFun.prototype.logd2 = function (msg) {
        logd(msg)
    }
    //实现logw2函数
    EcFun.prototype.logw2 = function (msg) {
        logw(msg)
    }
    //实现home2函数
    EcFun.prototype.home2 = function () {
        return home()
    }

    //这里实例化对象，然后进行调用相关的方法
    //传递js的实例对象到java代码中
    var obj2 = new com.plugin.AxrNAVUFVC.CallJSTest(new EcFun());
    obj2.logw2(new Date());
    obj2.logd2("我是调试日志");
    obj2.home2()

}

function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

main();
