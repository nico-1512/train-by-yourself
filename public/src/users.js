$(document).ready((e)=>{
    //e.preventDefault()
    $.get('/get-users', (data)=>{
        let obj = JSON.parse(data)
        
        obj.forEach(element => {
            addToTable(element.id, element.username, element.email, element.is_admin)
        });
    })
})

function addToTable(id, user, email, admin){
    const tr = document.createElement('tr')

    const userField = document.createElement('td')
    const emailField = document.createElement('td')
    const adminField = document.createElement('td')
    const buttonField = document.createElement('td')
    const button = document.createElement('button')
    $(button).addClass('btn btn-primary').attr('id', id).attr('type', 'button').text('Modify')
    $(buttonField).append($(button))

    $(userField).text(user)
    $(emailField).text(email)
    $(adminField).text(admin)

    $('#user-table').append($(tr).append($(userField), $(emailField), $(adminField), $(buttonField)))
    let obj = {
        user: '',
        email: '',
        password: '', 
        admin: false
    }
    
    $(`#${id}`).click((e)=>{
        if(admin == true){
            $('#is-admin').prop('checked', true)
            obj.admin = true
        }

        $('.modal').modal('show')
        $('#modal-title').text(`Modify user ${user}: `)
       
         
        $('#save').click((e)=>{
            if($('#user-input').val() != undefined){
                obj.user = $('#user-input').val()
            }

            if($('#email-input').val() != undefined){
                obj.email = $('#email-input').val()
            }
    
            if($('#password-input').val()){
                obj.password = $('#password-input').val()
            }
    
            if($('#is-admin').is(':checked')){
                obj.admin = true
            }else{
                obj.admin = false
            }

            $('#email-input').val(undefined)
            $('#password-input').val(undefined)
            $('#is-admin').prop('checked', false)
            $('.modal').modal('hide')

            $.post('/edit-user', {string: JSON.stringify(obj), id: id}, (data)=>{
                
            })
            window.location.href='/users'
        })

        $('#delete-user').click((e)=>{
            $('.modal').modal('hide')

            $.post('/delete-user', {id: id}, (data)=>{
                if(data){
                    $('#user-table').html('')
                    $.get('/get-users', (data)=>{
                        let obj = JSON.parse(data)
                        
                        obj.forEach(element => {
                            addToTable(element.id, element.username, element.email, element.is_admin)
                        })
                        
                    })
                }
            })
        })
    })
}

$('#back').click((e)=>{
    window.location.href='/home'
})