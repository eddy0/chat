/*
let api = new Ajax()
api.all().then()

get(path)
post({
path: path,
data: data})
all()
add(data)
update(id, data)
remove(id)

*/

class Ajax {
    constructor() {
        this.baseUrl = 'http://111.230.7.89'
    }

    ajaxImg({ path, data}) {
        let method = 'POST'
        let url = this.baseUrl + path

        let promise = new Promise((resolve, reject) => {
            const r = new XMLHttpRequest()
            r.open(method, url, true)
            r.onreadystatechange = () => {
                if(r.readyState === 4) {
                    let res = JSON.parse(r.response)
                    resolve(res)
                }
            }
            r.onerror = () => {
                reject(r)
            }
            r.send(data)
        })
        return promise
    }

    ajaxpro({method, path, headers, data}) {
        method = method || 'GET'
        path = path || '/'
        headers = headers || 'application/json'
        data = data || {}
        let url = this.baseUrl + path
        let promise = new Promise((resolve, reject) => {
            const r = new XMLHttpRequest()
            r.open(method, url, true)
            r.setRequestHeader('Content-Type', headers)
            r.onreadystatechange = () => {
                if(r.readyState === 4) {
                    let res = JSON.parse(r.response)
                    resolve(res)
                }
            }
            r.onerror = () => {
                reject(r)
            }

            data = JSON.stringify(data)
            r.send(data)
        })
        return promise
    }

    get(path, headers) {
        let method = 'GET'
        return this.ajaxpro({
            method: method,
            path: path,
            headers: headers,
        })
    }

    post({path, data, headers}) {
        let method = 'POST'
        return this.ajaxpro({
            method: method,
            path: path,
            data: data,
            headers: headers,
        })
    }
}

class ChatAjax extends Ajax {
    constructor() {
        super()
        this.baseUrl = this.baseUrl + '/chat/api'
    }

    add(data) {
        let path = '/add'
        return this.post({
            path: path,
            data: data
        })
    }
}

