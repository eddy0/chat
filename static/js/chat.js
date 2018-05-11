const post = (val, socket) => {
    let id = $('.messages-list').attr('data-id')
    let form = {
        content: val,
        id: id,
        date: Date.now(),
    }
    socket.emit('message', form)
}

const messageEvent = (socket) => {

    $('.btn-chat-send').on('click', (event) => {
        let input = $('.input-chat-content')
        let val = input.val()
        post(val, socket)
        input.val('')
    })

    $('.input-chat-content').on( 'keyup',  (event) => {
        if (event.key === 'Enter') {
            let val = event.target.value
            event.target.value= ''
            post(val, socket)
        }
    })

}


/*
 <div class="feed">
                     <img src="/user/avatar/${data.user.avatar}"  title="${data.user.username}" alt="${data.user.username}" />
                      <span> ${data.user.username} </span>
                     </div>

 */

const templateFriend = (data) => {
    let t = `
                    <li class="replies clearfix">
                    <p class="content-detail">${data.content}</p>
                </li>

            `
    return t
}


const templateSelf = (data) => {
    let t = `
                <li class="sent clearfix">
                    <p class="content-detail">${data.content}</p>
                </li>
            `
    return t
}

const newTemplate = (data) => {
    const t = `
                <li class="contact" data-id="${data.user._id}" data-socket=''>
                    <div class="wrap">
                        <img src="/user/avatar/${data.user.avatar}" alt="" />
                        <div class="meta">
                            <p class="name">${data.user.username}</p>
                            <p class="preview">${data.content || ''}</p>
                        </div>
                    </div>
                </li>
            `
    return t
}

const appendTime = (time, wrapper) => {
    const t = `
             <li class="time"> ${ new Date(time).toLocaleString() }</li>
            `
    wrapper.append(t)
}


const socketEvent = (socket) => {
    // socket.on('new', function(data){
    //     let t
    //     let wrapper = $('.contacts-list')
    //     log(data)
    //     t =  newTemplate(data)
    //     wrapper.append(t)
    // })

    // socket.on('delete', function(id){
    //     let wrapper = $('.contacts-list')
    //     let item = wrapper.find('li').find(`[data-id=${id}]`)
    //     console.log('item', item)
    // })

    socket.on('count', function(n){
        let count = e('.chat-count')
        count.innerText = `${n} connection`
    })

    socket.on('id', function(id){
        let list = e('.messages-list')
        list.dataset.id = id
    })


    socket.on('message', function(data){
        let t
        let wrapper = $('.messages-list')
        let id = wrapper.attr('data-id')
        let time = Number(data.date)
        appendTime(time, wrapper)
        log(id, data, data.id)
        if ( id !== data.id ) {
            t = templateFriend(data)
        } else {
            t = templateSelf(data)
        }
        wrapper.append(t)

        setTimeout( () => {
            $(".messages").animate({ scrollTop: $('.messages')[0].scrollHeight }, "fast");
        }, 300)
    })
}

const main = () => {
    $(".messages").animate({ scrollTop: $(this)[0].scrollHeight }, 'fast' )
    let socket = io()
    messageEvent(socket)
    socketEvent(socket)
}

main()


