var html5client={};
html5client.webdb={};
html5client.webdb.db=null;

createDatabase=function()
{
    var dbsize=5*1024*1024;
    html5client.webdb.db=openDatabase("vanet","1.0","vanet",dbsize);
};

createTable=function()
{
    var db=html5client.webdb.db;
    db.transaction(function(tx)
    {
        tx.executeSql("CREATE TABLE IF NOT EXISTS register_info(uid varchar(255) primary key,name varchar(255),phone varchar(255),pass varchar(255),vehno varchar(255))",[],function(){ });
       
        tx.executeSql("CREATE TABLE IF NOT EXISTS driving_info(id integer primary key autoincrement,uid varchar(255),start_date date,start_time time,end_date date,end_time time,source_long varchar(255),source_lat varchar(255),dest_long varchar(255),dest_lat varchar(255),distance varchar(255),enddate_time long)",[],function(){ });
    });
};

function init_client()
{ 
    createDatabase();
    createTable();
}

function registerUser(uid,name,phone,vehno,pass)
{
    var db=html5client.webdb.db;
    db.transaction(function(tx)
    {
        tx.executeSql("INSERT INTO register_info(uid,name,phone,pass,vehno) VALUES(?,?,?,?,?)",[uid,name,phone,pass,vehno],function(tx,rs){
            window.location.href="login.html";
                
        });
    });
}

function loginUser(name,pass)
{
    var db=html5client.webdb.db;
    db.transaction(function(tx)
    {
        tx.executeSql("SELECT * FROM register_info WHERE name=? AND pass=?",[name,pass],function(tx,rs){
            var len=rs.rows.length;
            if(len>0)
            {
                localStorage.setItem("vehno",rs.rows.item(0).vehno);
                window.location.href="home.html";               
            }
            else
            {
                navigator.notification.alert("Invalid username or password.",function(){ },"Warning","Ok");

            }
        });
    });
}

function checkUserRegistration()
{
    var db=html5client.webdb.db;
    
    db.transaction(function(tx)
    {
        tx.executeSql("SELECT * FROM register_info",[],function(tx,rs){
            
            var len=rs.rows.length;
            if(len>0)
            {
                window.location.href="login.html";
            }
            else
            {
                window.location.href="register.html";
            }
        });
    });

}

function storeDrivingInfo(uid,startdate,starttime,sourcelong,sourcelat,enddate,endtime,destlong,destlat,distance)
{
    var db=html5client.webdb.db;
    
    db.transaction(function(tx)
    {                
        var edtime=new Date().getTime();
        
        tx.executeSql("INSERT INTO driving_info(uid,start_date,start_time,source_long,source_lat,end_date,end_time,dest_long,dest_lat,distance,enddate_time) VALUES(?,?,?,?,?,?,?,?,?,?,?)",[uid,startdate,starttime,sourcelong,sourcelat,enddate,endtime,destlong,destlat,distance,edtime],function(tx,rs){
                           
            window.location.href="info.html";
             
            });
    });
}

function getCurDrivingDdetails()
{
    var db=html5client.webdb.db;
        
    db.transaction(function(tx)
    {        
        tx.executeSql("SELECT * FROM driving_info",[],function(tx,rs)
        {
            var len=rs.rows.length;
            $("#startdate").text("-");
            $("#starttime").text("-");
            $("#source").text("-");
            $("#enddate").text("-");
            $("#endtime").text("-");
            $("#dest").text("-");
            $("#distance").text("0 m");
            
            for(var i=0;i<len;i++)
            {
                $("#startdate").text(rs.rows.item(i).start_date);
                $("#starttime").text(rs.rows.item(i).start_time);
                $("#source").text(rs.rows.item(i).source_long+", "+rs.rows.item(i).source_lat);
                $("#enddate").text(rs.rows.item(i).end_date);
                $("#endtime").text(rs.rows.item(i).end_time);
                $("#dest").text(rs.rows.item(i).dest_long+", "+rs.rows.item(i).dest_lat);
                $("#distance").text(rs.rows.item(i).distance+" m");
            }
            
        });       
        
    });   
}

function getDrivingInfoByType(sel_id)
{
    var db=html5client.webdb.db;
    
    $("#hdr").text("Today's");
    db.transaction(function(tx)
    {
        if(sel_id==0)
        {
            var tdate=new Date().toLocaleDateString();

            tx.executeSql("SELECT * FROM driving_info WHERE end_date=?",[tdate],function(tx,rs)
            {
                var len=rs.rows.length;
                var dist=0;
                $("#rideno").text("No Ride");
                $("#dist").text(dist+" m");
                for(var i=0;i<len;i++)
                {
                    dist=+dist+(+rs.rows.item(i).distance);

                    $("#rideno").text(i+1);
                    $("#dist").text(dist+" m");
                }
            });
        }
        else if(sel_id==1)
        {
            var ttime=new Date().getTime();
            var lastwktm=+ttime-604800000;
            
            $("#hdr").text("Last Week");
            tx.executeSql("SELECT * FROM driving_info WHERE enddate_time > ?",[lastwktm],function(tx,rs)
            {
                var len=rs.rows.length;
                var dist=0;
                
                $("#rideno").text("No Ride");
                $("#dist").text(dist+" m");
                for(var i=0;i<len;i++)
                {
                    dist=+dist+(+rs.rows.item(i).distance);

                    $("#rideno").text(i+1);
                    $("#dist").text(dist+" m");
                }
            });
        }
        else if(sel_id==2)
        {
            var totime=new Date().getTime();
            var lastmnthtm=+totime-2592000000;
            
            $("#hdr").text("Last Month");
            tx.executeSql("SELECT * FROM driving_info WHERE enddate_time > ?",[lastmnthtm],function(tx,rs)
            {
                var len=rs.rows.length;
                var dist=0;
                
                $("#rideno").text("No Ride");
                $("#dist").text(dist+" m");
                for(var i=0;i<len;i++)
                {
                    dist=+dist+(+rs.rows.item(i).distance);

                    $("#rideno").text(i+1);
                    $("#dist").text(dist+" m");
                }
            });
        }
    });
}