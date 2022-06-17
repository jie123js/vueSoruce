const http = require('http')
const url = require('url')
let routes = []

function createApplication(){
    return { // app
        get(path,handler){
            routes.push({
                path,
                handler,
                method:'get'
            })
        },
        listen(){
            function done(req,res){
                res.end(`Cannot ${req.method} ${req.url}`)
            }
            const server =  http.createServer((req,res)=>{
                let requestMethod = req.method.toLowerCase();
                let {pathname:requestUrl} = url.parse(req.url)
                for(let i = 0; i < routes.length;i++){
                    let route = routes[i];
                    if(route.path === requestUrl && route.method === requestMethod){
                        return route.handler(req,res)
                    }
                }
                done(req,res)
            });

            server.listen(...arguments)
        }
    }
}
// express = createApplication
module.exports = createApplication