/**
 * Created by Vince on 2015/10/1.
 */

var datatable = null;
//�����������ݿ�Ķ���,(�������汾�ţ����������ݿ��С)
var db = openDatabase("Mydata","","My Database",1024*100);

function init(){
    //��ʼ������
    datatable = document.getElementById("datatable");
    showAllData();
}

function removeAllData(){
    //�Ƴ���������
    var content = document.getElementsByName("content");
    for(var i=0; i<content.length; i++){
        content[i].parentNode.removeChild(content[i]);
    }
}

function showData(row){
    //��ʾ����
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
    //��ʾ��������
    //ʹ��transation����������
    db.transaction(function(tx){

        //�������ݿ�
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
