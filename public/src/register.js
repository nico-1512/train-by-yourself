$('#register-form').submit((e)=>{
    e.preventDefault()
    if($('#password').val() === $('#confirm-password').val()){
        $.post('/register-form', {name: $('#name').val(), surname: $('#surname').val(), email: $('#email').val(), password: $('#password').val()}, (data)=>{
            console.log(data);
            if(data === 'alert'){
               showAlert('This email il already in use')
            }else{
                window.location.href = '/home'
            }
        })
    }else{
        showAlert('The passwords are different')
    }
})

function showAlert(text){
    if($('#alert-div').hasClass('d-none')){
        $('#alert-div').removeClass('d-none')
    }
    $('#alert-div').text('')
    $('#alert-div').text(text)

}