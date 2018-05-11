const log = console.log.bind(console)

const e = (sel, element=document) => element.querySelector(sel)

const es = (selector, element=document) => {
    return element.querySelectorAll(selector)
}

const bind = (selector, eventName, callback) => {
    const element = e(selector)
    element.addEventListener(eventName, (event)=> {
        callback(event)
    })
}

const bindAll = (selector, eventName, callback) => {
    const element = es(selector)
    for (let i = 0; i < element.length; i++ ) {
        let tag = element[i]
        tag.addEventListener(eventName, (event)=> {
            callback(event)
        })
    }
}

const removeClassAll = (className) => {
    const element = es(`.${className}`)
    for (let i = 0; i < element.length; i++ ) {
        element[i].classList.remove(className)
    }
}

const ajax = (method, path, data, callback) => {
    const r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = () => {
        if (r.readyState === 4 ) {
                let res = JSON.parse(r.response)
                callback(res)
            }
        }
    data = JSON.stringify(data)
    r.send(data)
}

const promiseAjax = (method, path, data) => {
    let promise = new Promise((resolve, reject) => {
        const r = new XMLHttpRequest()
        r.open(method, path, true)
        r.setRequestHeader('Content-Type', 'application/json')
        r.onreadystatechange = () => {
            if (r.readyState === 4) {
                    resolve(r.response)
            }
        }
        r.onerror = () => {
            reject(r)
        }
        r.send(data)
    })
    return promise
}

const get = (callback) => {
    let path = 'https://vip.kybmig.cc/sandbox/todo/271454165/all'
    ajax('GET', path, '', callback)
}

const add = (data, callback) => {
    let task = {
        content:  data,
        done: false,
    }
    let todo = {
        task: JSON.stringify(task)
    }
    let path = 'https://vip.kybmig.cc/sandbox/todo/271454165/add'
   ajax('POST', path, todo, callback)
}

const update = (id, data) => {
    let path = 'https://vip.kybmig.cc/sandbox/todo/271454165/update/' + id
    ajax('POST', path, data, (r) => {
        console.log('updated', r)
    })
}

const remove = (id) => {
    let path = 'https://vip.kybmig.cc/sandbox/todo/271454165/delete/' + id
    ajax('GET', path, '', (r) => {
        console.log('deleted', r)
    })
}

const templateTodo = (todo) => {
    const {id, qq, task} = todo
    const {content, done} = JSON.parse(task)
    let status = ''
    if (done) {
        status = 'done'
    }
    const t = `
    <div class="todo-wrapper" data-id=${id}>
        <input type="checkbox" class="btn-todo-done ${status}">

        <span class="todo-content ${status}" contenteditable="false">${content}</span>

        <div class="todo-action">
            <svg class="icon btn-todo-edit" fill="#ffffff" height="20" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
            <svg class="icon btn-todo-delete" fill="#ffffff" height="20" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
        </div>
    </div>
    `
    return t
}

const appendTodo = (todo) => {
    const t = templateTodo(todo)
    const container = e('.todo-container')
    container.insertAdjacentHTML('beforeend', t)
}

const initHtml = () => {
    const t = tempalteHtml()
    const body = document.body
    body.innerHTML = ''
    body.insertAdjacentHTML('beforeend', t)
}


const insertTodo = (todo) => {
    if (todo !== undefined && todo.length !== 0) {
        todo.map( t => {
            appendTodo(t)
        })
    } else {
        console.log('no todo', todo)
    }
}

const initTodo = () => {
    get( (todo) => {
        insertTodo(todo)
    })
}

const init = () => {
    initTodo()
}

const showContent = (todo) => {
    const container = e('.todo-container')
    container.innerHTML=''
    insertTodo(todo)
}

const bindShowAll = (self, todo) => {
    if (self.classList.contains('wd-show-all')){
        showContent(todo)
    }
}

const bindShowTodo = (self, todo) => {
    if (self.classList.contains('wd-show-todo')){
        todo = todo.filter( t => {
            let {done} = JSON.parse(t.task)
            return done === false
        })
        console.log('todo', todo)
        showContent(todo)
    }
}

const bindShowDone = (self, todo) => {
    if (self.classList.contains('wd-show-done')){
        todo = todo.filter( t => {
            let {done} = JSON.parse(t.task)
            return done === true
        })
        console.log('done', todo)
        showContent(todo)
    }
}

const bindMenuDelegate = () => {
    bind('.wd-todo-menu', 'click', (event)=>{
        const self = event.target
        log('self', self)
        removeClassAll('show')
        self.classList.add('show')
        get( (todo) => {
            bindShowAll(self, todo)
            bindShowTodo(self, todo)
            bindShowDone(self, todo)
        })
    })
}

const AddContainerhandler = () => {
    const icon = e('.icon-todo-add')
    const addBar = e('.todo-addContainer')
    const input = e('.input-todo-add', addBar)
    if (icon.classList.contains('add-open')) {
        removeClassAll('add-open')
        input.value = ''
    } else{
        icon.classList.add('add-open')
        addBar.classList.add('add-open')
        setTimeout( () => {
            input.focus()
        }, 60)
    }
}

const activeAddBar = () => {
    bind('.icon-todo-add', 'click', AddContainerhandler)
}

const addTodo = () => {
    bind('.btn-todo-add', 'click', (event)=> {
        const input = e('.input-todo-add')
        const task = input.value
        add(task, (r)=> {
            console.log('r', r)
            appendTodo(r)
        })
        AddContainerhandler()
    })
}

const deleteTodo = (self) => {
    const wrapper = self.closest('.todo-wrapper')
    const id = wrapper.dataset.id
    wrapper.remove()
    remove(id)
}

const updateTodo = (container) => {
    const wrapper = container.closest('.todo-wrapper')
    const id = Number(wrapper.dataset.id)
    let content = container.innerText
    let done = false
    if (container.classList.contains('done')) {
        done = true
    }
    let task = {
        content: content,
        done: done
    }
    let data = {
        id: id,
        task: JSON.stringify(task)
    }
    update(id, data)
}

const editUpdateEvent = (container) => {
    container.addEventListener('keydown', (event)=>{
        let key = event.key
        if (key ==='Enter') {
            event.preventDefault()
            container.blur()
        }
    })

    container.addEventListener('blur', ()=>{
        container.setAttribute('contenteditable', 'false')
        updateTodo(container)
    })
    }

const editTodo = (self) => {
    const wrapper = self.closest('.todo-wrapper')
    const content = e('.todo-content', wrapper)
    if (!content.classList.contains('done')){
        content.setAttribute('contenteditable', 'true')
        content.focus()
        editUpdateEvent(content)
    }
}

const finishTodo = (self) => {
    const wrapper = self.closest('.todo-wrapper')
    const content = e('.todo-content', wrapper)
    content.classList.toggle('done')
    self.classList.toggle('done')
    content.contentEditable=false
    updateTodo(content)
}

const bindUpdateDelegate = () => {
    bind('.todo-container', 'click', (event)=> {
        let element = e('.todo-container')
        const self = event.target
        if (self.classList.contains('btn-todo-delete')) {
            deleteTodo(self)
        } else if (self.classList.contains('btn-todo-edit')) {
            editTodo(self)
        } else if (self.classList.contains('btn-todo-done')) {
            finishTodo(self)
        }
    })
}

const bindAddEvent = () => {
    activeAddBar()
    addTodo()
}

const bindEvents = () => {
    bindMenuDelegate()
    bindAddEvent()
    bindUpdateDelegate()
}

const insertMovie = (t) => {
    const container = e('.movie-container')
    container.insertAdjacentHTML('beforeend', t)
}

const appendMovie = (movie) => {
    let { rank, title, rate, year, director, actors, link, imgUrl, video } = movie
    const t = `
        <div class="movie-cell" style="display: flex; padding: 20px 0 20px; border-bottom: 1px solid #fff;font-size: 16px ">
        <div class="movie-avatar" style="margin-right: 10px; position: relative">
              <a href="${link}"><img src="${imgUrl}" alt="${title}" style=" position: relative;top: 50%; left: 0;transform: translateY(-50%);"></a> 
        </div>
        <div class="movie-detail" style="flex: 1">    
            <div class="movie-rank">排名: ${rank}</div>
            <div class="movie-title">影名: <a href="${link}">${title}</a></div>
            <div class="movie-title">年份: ${year}</div>
            <div class="movie-star">评分: ${rate}</div>
            <div class="movie-dirctor">导演: ${director}</div>
            <div class="movie-actors">演员: ${actors}</div>
            <div href="#id-video" class="movie-trailer" data-src="${video}">
              观看预告片
            </div>
        </div>
        </div>
    `
    insertMovie(t)
}

const test = () => {
    let url = 'https://raw.githubusercontent.com/eddy0/myownwheel/master/crawler/download/result.json'
    fetch(url).then( (res) => res.json())
        .then( (data) => {
            data.map(d => {
                appendMovie(d)
            })
        })
        .then( () => bindTrailer())
}

const bindTrailer = () => {
    bindAll('.movie-trailer', 'click', (event) => {
        const self = event.target
        const src = self.dataset.src
        if (src !== 'null'){
            const video = e('#id-video')
            video.src = src
            window.scrollTo(0, 0)
        }
    })
}


const __main = () => {
    init()
    bindEvents()
    test()
}

__main()
