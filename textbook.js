/**
 * Created by Vince on 2015/10/1.
 */

var datatable = null;
//创建访问数据库的对象,(库名，版本号，描述，数据库大小)
var db = openDatabase("Mydata","","My Database",1024*100);

function init(){
    //初始化调用
    datatable = document.getElementById("datatable");
    showAllData();
}

function removeAllData(){
    //移除所有数据
    var content = document.getElementsByName("content");
    for(var i=0; i<content.length; i++){
        content[i].parentNode.removeChild(content[i]);
    }
}

function showData(row){
    //显示数据
    var t = new Date();
    t.setTime(row.time);
    var divStr = '<div class="panel panel-primary" name="content"><div class="panel-heading"><h3 class="panel-title">';
    divStr += row.name;
    divStr += '<small class="text-right">&nbsp&nbsp&nbsp';
    divStr += t.toLocaleDateString();
    divStr += '</small></h3></div><div class="panel-body"><p>';
    divStr += row.message;
    divStr += '</p></div></div>';
    datatable.innerHTML += divStr;
}

function showAllData(){
    //显示所有数据
    //使用transation进行事务处理
    db.transaction(function(tx){

        //创建数据库
        tx.executeSql("create table if not exists MsgData(name TEXT,message TEXT,time INTEGER)",[]);
        tx.executeSql("select * from MsgData",[], function (tx,rs) {
            removeAllData();
            for(var i=0; i<rs.rows.length; i++){
                showData(rs.rows.item(i));
            }
        },
            function(tx,error){
                alert(error.source+"::"+error.message);
            }
        )
    })
}
//
function addData(name,message,time){
    db.transaction(function(tx){
        tx.executeSql("insert into MsgData values(?,?,?)",[name,message,time], function (tx,rs) {
            showAllData();
        },
            function(tx,error){
                alert(error.source+"::"+error.message);
            }
        )
    })
}

function saveData(){
    var name = document.getElementById("name").value;
    var memo = document.getElementById("memo").value;
    var time = new Date().getTime();
    addData(name,memo,time);
}
