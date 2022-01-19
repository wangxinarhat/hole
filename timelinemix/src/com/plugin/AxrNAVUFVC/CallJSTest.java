package com.plugin.AxrNAVUFVC;


public class CallJSTest {
    EcFun ecFun;

    public CallJSTest(EcFun ecFun){

        this.ecFun=ecFun;
    }

    public void logd2(String msg){

        ecFun.logd2(msg);
    }
    public void logw2(String msg){

        ecFun.logw2(msg);
    }

    public boolean home2(){
        return ecFun.home2();
    }
}
