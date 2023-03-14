let genericTarget
let specificTarget
$('#generic-target-select-menu').change(function(){ 
    $('#specific-target-select-menu').find('option').remove()
    genericTarget = $(this).val()
    if(genericTarget !== 'None'){
        if($(this).val() === 'shoulder'){
            checkClass()
            const optShoulder = document.createElement('option')
            $(optShoulder).attr('value', 'shoulder').text('Shoulders')
            const optTrapezius = document.createElement('option')
            $(optTrapezius).attr('value', 'trapezius').text('Trapezius')
            $('#specific-target-select-menu').append($(optShoulder), $(optTrapezius))

        }else if(genericTarget === 'arm'){
            checkClass()
            const optBiceps = document.createElement('option')
            $(optBiceps).attr('value', 'biceps').text('Biceps')
            const optTriceps= document.createElement('option')
            $(optTriceps).attr('value', 'triceps').text('Triceps')
            const optForearms = document.createElement('option')
            $(optForearms).attr('value', 'forearm').text('Forearms')
            $('#specific-target-select-menu').append($(optForearms), $(optBiceps), $(optTriceps))
        }else if(genericTarget === 'leg'){
            checkClass()
            const optLeg = document.createElement('option')
            $(optLeg).attr('value', 'leg').text('Leg')
            const optCalf = document.createElement('option')
            $(optCalf).attr('value', 'calf').text('Calf')
            $('#specific-target-select-menu').append($(optLeg), $(optCalf))

        }else if(genericTarget === 'core'){
            checkClass()
            const optCore = document.createElement('option')
            $(optCore).attr('value', 'core').text('Core')
            const optSideAbs = document.createElement('option')
            $(optSideAbs).attr('value', 'side-abs').text('Side abs')
            const optUpperAbs = document.createElement('option')
            $(optUpperAbs).attr('value', 'upper-abs').text('Upper abs')
            $('#specific-target-select-menu').append($(optCore), $(optSideAbs), $(optUpperAbs))
            
        }else if(genericTarget === 'chest'){
            checkClass()
            const optChest = document.createElement('option')
            $(optChest).attr('value', 'chest').text('Chest')
            const optUpperChest = document.createElement('option')
            $(optUpperChest).attr('value', 'upper-chest').text('Upper chest')
            const optLowerChest = document.createElement('option')
            $(optLowerChest).attr('value', 'lower-chest').text('Lower chest')
            const optMidChest = document.createElement('option')
            $(optMidChest).attr('value', 'mid-chest').text('Middle chest')
            $('#specific-target-select-menu').append($(optChest), $(optUpperChest), $(optLowerChest), $(optMidChest))
            
        }else if(genericTarget === 'back'){
            checkClass()
            const optBack = document.createElement('option')
            $(optBack).attr('value', 'back').text('Back')
            $('#specific-target-select-menu').append($(optBack))
        }
    }
    specificTarget = $('#specific-target-select-menu').val()
})
$('#specific-target-select-menu').change(function() { specificTarget = $(this).val()})
let sets
$('#sets-select-menu').change(function() { sets = $(this).val()})
let minReps
$('#min-reps-select-menu').change(function() { minReps = $(this).val()})
let maxReps
$('#max-reps-select-menu').change(function() { maxReps = $(this).val()})
let description
$('#description').change(function() { description = $(this).val()})
let exerciseName 
$('#exercise-name').change(function() { exerciseName = $(this).val()})


$('#form-exercise').submit((e)=>{
    e.preventDefault()
    //console.log(`Target: ${target}, sets: ${sets}, minReps: ${minReps}, maxReps: ${maxReps}, desc: ${description}`)
    if(exerciseName !== undefined && genericTarget !== undefined && sets !== undefined && minReps !== undefined && maxReps !== undefined && description !== ''){
        if(maxReps === 'backdown'){
            let obj = {
                exerciseName: exerciseName,
                genericTarget: genericTarget,
                specificTarget: specificTarget,
                sets: sets,
                min: minReps, 
                max: maxReps,
                description: description 
            }
    
            $.post('/new-exercise', {jsonString: JSON.stringify(obj)}, (data)=>{
                console.log(data)
                if(data){
                    window.location.href = "/home"
                }
            } )  
        }else{
            if(parseInt(minReps) > parseInt(maxReps)){
                showAlert('The number of max reps cannot be lower than the number of minimum reps, please set other values')
            }else{
                let obj = {
                    exerciseName: exerciseName,
                    genericTarget: genericTarget,
                    specificTarget: specificTarget,
                    sets: sets,
                    min: minReps, 
                    max: maxReps,
                    description: description 
                }
        
                $.post('/new-exercise', {jsonString: JSON.stringify(obj)}, (data)=>{
                    console.log(data)
                    if(data){
                        window.location.href = "/home"
                    }
                } )
            }
        }    
    }else{
        showAlert('Some input is empty/undefined')
    }      
})

function checkClass(){
    if($('#specific-target-select-menu').hasClass('d-none') && $('#specific-target-label').hasClass('d-none')){
        $('#specific-target-select-menu').removeClass('d-none')
        $('#specific-target-label').removeClass('d-none')
    }
}

function showAlert(text){
    if($('.alert').hasClass('d-none')){
        $('.alert').removeClass('d-none').text(text)
    }else if($('.alert').text !== text){
        $('.alert').text(text)
    }
}