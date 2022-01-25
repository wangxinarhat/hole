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
    if (queryRet && Object(queryRet).length > 0) {
        let timeDiff = (Date.parse(new Date()) - parseInt(queryRet[0]["update_time"])) / (24 * 60 * 60 * 1000);
        // logi("isNeedMessage : 时间差 = " + timeDiff + " 天");
        // logi("isNeedMessage : 最后一条消息是否重复 = " + (queryRet[0]["last_message"] === message));
        if (timeDiff < 15) {
            logi("isNeedMessage  ： nickname = " + nickname + " 15天内发送过消息，今天不要再打扰了～");
            isNeed = false;
        } else if (queryRet[0]["last_message"] === message) {
            logw("isNeedMessage  ： nickname = " + nickname + " 这条消息15天前已经发送过了～");
            isNeed = false;
        } else {
            logi("isNeedMessage  ： nickname = " + nickname + " 之前发送过，但今天还是可以再发～");
            isNeed = true;
        }
    } else {
        isNeed = true;
        logi("isNeedMessage  ： nickname = " + nickname + " 没查到记录，发消息吧～");
    }
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

    if (queryRet && Object(queryRet).length > 0) {
        let times = parseInt(queryRet[0]["times"]) + 1;
        let curTimestamp = Date.parse(new Date());
        let sql = "UPDATE opt_log SET nickname =".concat('\"').concat(nickname).concat('\"').concat(", times = ").concat(times).concat(", update_time =").concat(curTimestamp).concat(", last_message =").concat('\"').concat(content).concat('\"').concat(" WHERE nickname = ").concat('\"').concat(nickname).concat('\";');
        let updateRet = sqlite.execSql(sql);
        logi("record ：update 给 " + nickname + " 第 " + times + " 次发消息了～");
        logd("record ：update result = " + updateRet);
    } else {
        let times = 1
        let curTimestamp = Date.parse(new Date());
        let sql = "INSERT INTO \"opt_log\" (\"nickname\", \"times\", \"update_time\", \"last_message\") VALUES(".concat('\"').concat(nickname).concat('\"').concat(",").concat(times).concat(",").concat(curTimestamp).concat(",").concat('\"').concat(content).concat('\"').concat(");");
        let insertRet = sqlite.execSql(sql);
        logi("record : insert 给 " + nickname + " 第 1 次发消息～");
        logd("record : insert result  = " + insertRet);
    }
}