var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
 
function templateHTML(title,list , body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEb1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">NameCard-홈페이지</a></h1><hr/>
    <a href="/?id=list">${list}</a>
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./NameCard', function(error, filelist){
          var title = '이름을 클릭하세요';
          var description = '목록에서 이름을 클릭하면 상세내용이 나옵니다.';
          var list = templateList(filelist);
          var template = templateHTML(title, '',  `<h2>${title}</h2>${description}</p>`,
          `<form action ="/create"  method="post">
                    <input type= "hidden" name="id" value="${title}">
                    <input type="submit"  value="생성">
                        </form>`);
          response.writeHead(200);
          response.end(template);
        });
      }}
      else if(pathname==='/create'){ 
        fs.readdir('./NameCard', function(error, filelist){
            var title = 'data - create';
            var list = templateList(filelist);
            var template = templateHTML(title,  ' ', '',
           `<form action ="/"  method="post">
            <input type= "hidden" name="id" value=" ">
            <input type="submit"  value="홈페이지로가기">
                </form><form action="http://localhost:3000/process_create" method="post">
                <p><input type="text" name="title" placeholder="이름"></p>
                <p>
                  <textarea name="description" placeholder="내용"></textarea>
                </p>
                <p>
                  
                </p>
              </form><form action ="/create_process"  method="post">
              <input type= "hidden" name="id" value="${title}">
              <input type="submit"  value="생성">
                  </form>` 
                  
            );
            response.writeHead(200);
            response.end(template);
          });
                        }
  else if(pathname==='/create_process'){

    var body='';
    request.on('data', function(data){
    body= body+data;
     });
    request.on('end',function(){
    var post= qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description= post.description;
    console.log(title);
    console.log(description);
     
        fs.writeFile(`NameCard/${title}`,description,'utf8',function(err){  
            response.writeHead(302,{Location:`/?id=${title}`});  
            response.end();
    }); 
   
});
response.writeHead(200);
response.end('success');
          
         }
});
app.listen(3000);