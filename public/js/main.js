let body_height = document.body.scrollHeight,
    window_height = $(window).height(),
    footer_height = $('footer').height();
if ((body_height - window_height) < 0) {
    $('footer').css({
        "position": "fixed",
        "bottom": "0"
    })
}

$(document).ready(function () {
    $('#verification-form').on('submit', function () {
        $('input[type=checkbox]:not(:checked)').each(function () {
            $(this).attr('checked', true).val('off');
        });
    })
})
$('.profile-editor').css('display', 'none')

function hideProfile() {
    $('.profile-header').html('Edit Profile')
    $('#edit-profile').css('display', 'none')
    $('.profile-display').css('display', 'none')
    $('.profile-editor').css('display', 'block')
}