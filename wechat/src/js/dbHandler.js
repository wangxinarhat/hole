const AES_PSD = "black_hole";
const OPT_LOG = "opt_log";
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
    let isNeed = false;
    let sql = "select * from ".concat("opt_log").concat(" where nickname = ").concat('\"').concat(nickname).concat('\";');
    logd("isNeedMessage : sql = " + sql);
    let queryRet = sqlite.query(sql);
    logd("isNeedMessage queryRet ：" + JSON.stringify(queryRet));

    if (queryRet && Object(queryRet).length > 0) {
        let timeDiff = (Date.parse(new Date()) - parseInt(queryRet[0]["update_time"])) / (24 * 60 * 60 * 1000);
        logd("时间差 = " + timeDiff + " 天");

        // || queryRet[0]["last_message"] === message
        if (timeDiff < 15) {
            isNeed = false;
        } else {
            isNeed = true;
        }
    } else {
        isNeed = true;
        logd("isNeedMessage  ： 没查到记录，发消息吧～");
    }
    logd("isNeedMessage ：isNeed = " + isNeed);
    return isNeed;
}

/**
 *
 * @param nickname
 * @param content
 */
function record(nickname, content) {
    logd("record nickname ：" + nickname);

    let sql = "select * from " + "opt_log" + "where nickname = " + nickname;
    let queryRet = sqlite.query(sql);
    logd("record queryRet ：" + queryRet + ", type = " + typeof queryRet);
    logd("record queryRet ：" + JSON.stringify(queryRet));

    if (queryRet) {
        logd("record queryRet ：更新数据 ～");
        // let updateRet = sqlite.update("opt_log", data, "nickname = " + nickname);
    } else {
        let times = 1
        let curTimestamp = Date.parse(new Date());
        logd("record queryRet ：插入数据 ～");
        let sql = "INSERT INTO \"opt_log\" (\"nickname\", \"times\", \"update_time\", \"last_message\") VALUES(".concat('\"').concat(nickname).concat('\"').concat(",").concat(times).concat(",").concat(curTimestamp).concat(",").concat('\"').concat(content).concat('\"').concat(");");
        logd("record sql ：" + sql);
        let insertRet = sqlite.execSql(sql);
        logd("record insertRet ：" + insertRet);
    }
}