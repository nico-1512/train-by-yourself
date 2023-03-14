$('#login-form').submit((e)=>{
    $.post('/login', { email: $('#email').val(), password : $('#password').val()}, (data)=>{
        console.log(data);
        if(data !== false){
            window.location.href = '/home'
        }else{
            $('#alert-div').removeClass('d-none')
            $('#alert-div').text('Incorrect login')
        }
    }) 
    e.preventDefault()

})