const DATABASE_NAME = "hole.db";
const CREATE_TABLE_SQL = "CREATE TABLE IF NOT EXISTS \"opt_log\" (\n" +
    "\t\"nickname\"\tTEXT NOT NULL,\n" +
    "\t\"times\"\tINTEGER,\n" +
    "\t\"update_time\"\tINTEGER,\n" +
    "\t\"last_message\"\tTEXT NOT NULL,\n" +
    "\tPRIMARY KEY(\"nickname\")\n" +
    ");";

function connect() {
    let create = sqlite.connectOrCreateDb(DATABASE_NAME);
    logd("connect db result：" + create);
    let createTable = sqlite.execSql(CREATE_TABLE_SQL);
    logd("connect create table result ：" + createTable);
}

function isNeedMessage(nickname, message) {
    let isNeed;
    let sql = "select * from ".concat("opt_log").concat(" where nickname = ").concat('\"').concat(nickname).concat('\";');
    logd("isNeedMessage : sql = " + sql);
    let queryRet = sqlite.query(sql);
    logd("isNeedMessage : queryRet = " + JSON.stringify(queryRet));

    if (queryRet && Object(queryRet).length > 0) {
        let timeDiff = (Date.parse(new Date()) - parseInt(queryRet[0]["update_time"])) / (24 * 60 * 60 * 1000);
        logi("isNeedMessage : 时间差 = " + timeDiff + " 天");
        logi("isNeedMessage : 最后一条消息是否重复 = " + (queryRet[0]["last_message"] === message));
        if (timeDiff < 15 || queryRet[0]["last_message"] === message) {
            isNeed = false;
        } else {
            isNeed = true;
        }
    } else {
        isNeed = true;
        logi("isNeedMessage  ： 没查到记录，发消息吧～");
    }
    logi("isNeedMessage ：需要发送消息吗 = " + isNeed);
    return isNeed;
}

/**
 *
 * @param nickname
 * @param content
 */
function record(nickname, content) {
    let sql = "select * from ".concat("opt_log").concat(" where nickname = ").concat('\"').concat(nickname).concat('\";');
    let queryRet = sqlite.query(sql);
    logi("record : nickname =" + nickname);
    logi("record : sql =" + sql);
    logd("record : queryRet = " + JSON.stringify(queryRet));

    if (queryRet && Object(queryRet).length > 0) {
        logd("record ：更新数据 ～");
        let times = parseInt(queryRet[0]["times"]) + 1;
        let curTimestamp = Date.parse(new Date());
        logi("record ：给 " + nickname + " 第 " + times + " 次，发祝福消息了～");

        let sql = "UPDATE opt_log SET nickname =".concat('\"').concat(nickname).concat('\"').concat(", times = ").concat(times).concat(", update_time =").concat(curTimestamp).concat(", last_message =").concat('\"').concat(content).concat('\"').concat(" WHERE nickname = ").concat('\"').concat(nickname).concat('\";');

        logi("record ：update sql = " + sql);
        let updateRet = sqlite.execSql(sql);
        logd("record ：更新结果 = " + updateRet);
    } else {
        let times = 1
        let curTimestamp = Date.parse(new Date());
        logd("record ：插入数据 ～");
        let sql = "INSERT INTO \"opt_log\" (\"nickname\", \"times\", \"update_time\", \"last_message\") VALUES(".concat('\"').concat(nickname).concat('\"').concat(",").concat(times).concat(",").concat(curTimestamp).concat(",").concat('\"').concat(content).concat('\"').concat(");");
        logd("record insert sql ：" + sql);
        let insertRet = sqlite.execSql(sql);
        logd("record insertRet ：" + insertRet);
    }
}