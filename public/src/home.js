$(document).ready( (e)=>{
    //e.preventDefault()
    $('#account').hover().css('cursor', 'pointer')
    $('#add-new-workout').hover().css('cursor', 'pointer')
    $('#users-list').hover().css('cursor', 'pointer')

    $.get('/session', (data)=>{
        if (data){
            $('#add-new-workout').removeClass('d-none')
            $('#users-list').removeClass('d-none')
        }
    })
    
    $('#left-arm').click((e)=>{
        request('arm')
    })
    $('#right-arm').click((e)=>{
        request('arm')
    })

    $('#right-leg').click((e)=>{
        request('leg')
    })
    $('#left-leg').click((e)=>{
        request('leg')
    })

    $('#abs').click((e)=>{
        request('core')
    })
    $('#chest').click((e)=>{
        request('chest')
    })

    $('#right-shoulder').click((e)=>{
        request('shoulder')
    })
    $('#left-shoulder').click((e)=>{
        request('shoulder')
    })
})

$('#add-new-workout').click((e)=>{
    window.location.href = '/add-new-exercise'
})

$('#users-list').click((e)=>{
    window.location.href = '/users'
})

function request(target){
    if(!$('#starting-title').hasClass('d-none')){
        $('#starting-title').addClass('d-none')
    }
    $('#exercises-list').html('')
    $.post('/get-exercise', {target: target}, (data)=>{
        let obj = JSON.parse(data)
        if(target === 'leg'){
            $('#target').text('Legs')
        }else if(target === 'arm'){
            $('#target').text('Arms')
        }else if(target === 'core'){
            $('#target').text('Core')
        }else if(target === 'chest'){
            $('#target').text('Chest')
        }else if(target === 'back'){
            $('#target').text('Back')
        }else if(target === 'shoulder'){
            $('#target').text('Shoulders')
        }

        obj.forEach(element => {
            let item = document.createElement('li')
            $(item).addClass('list-group-item d-flex flex-row')

            let span = document.createElement('span')
            $(span).text(element.name).addClass('col-4')

            let spTarget = document.createElement('span')
            $(spTarget).addClass('text-success col-4 text-center').css('font-weight', 'bold').text(element.specificTarget)
            
            let button = document.createElement('button')
            $(button).addClass('btn w-100 btn-primary').attr('type', 'button').attr('data-toggle', 'modal').attr('data-target', '#exampleModal')
            $(button).text('View')
            $(button).click((e)=>{
                $('#modal').modal('show')
                $('#modal-title').text(element.name)
                let specificTarget = document.createElement('span')
                $(specificTarget).text(`Specific target: ${element.specificTarget}`)
                let sets = document.createElement('span')
                $(sets).text(`Sets: ${element.set_number}`)
                let min = document.createElement('span')
                $(min).text(`Min reps: ${element.min_reps}`)
                let max = document.createElement('span')
                $(max).text(`Max reps: ${element.max_reps}`)
                let description = document.createElement('span')
                $(description).text(`Description: ${element.description}`)
                
                $('.modal-body').append($(specificTarget), document.createElement('br'), $(sets), document.createElement('br'), $(min), document.createElement('br'), $(max), document.createElement('br'), $(description), document.createElement('br'))
                
            })

            $(item).append($(span), $(spTarget), $(button))
            if($('#exercises-list').hasClass('d-none') || $('#target').hasClass('d-none')){
                $('#exercises-list').removeClass('d-none')
                $('#target').removeClass('d-none')
            }
            $('#exercises-list').append($(item))
        })
    })
}

$('#hide-modal').click((e)=>{
    e.preventDefault()
    $('#modal').modal('hide')
    $('.modal-body').html('')
})

$('#log-out').click(()=>{
    $.post('/log-out', (data)=>{
        if(data){
            window.location.href = '/delete-session'
        }
    })
})

$(document).bind('beforeunload', (e)=>{
    e.preventDefault()
    $.get('/refresh', (data)=>{
        if(data){
            window.location.href = '/no-refresh'
        }
    })
})

