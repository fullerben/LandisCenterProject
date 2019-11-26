$(document).ready(function () {
    $('.mark-as-done').on('click', (e) => {
        e.preventDefault()
        $.ajax({
            url: `/actions/complete/${e.currentTarget.id}`,
            type: 'POST',
        })
        location.reload()
    })  
})