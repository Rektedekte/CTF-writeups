function search(query) {
    $(".list-writeup").each((n, e) => {
        $(e).removeClass('hidden');
        $(e).addClass('hidden');
    });

    $('.list-writeup')
        .filter((idx, chall) => {
            const challInfo = $(chall).data('searchable');
            if (challInfo == '')
                return false;
            return challInfo.includes(query)
        })
        .each((n, e) => {
            $(e).removeClass('hidden')
        });
}

$('#search').on('keyup', () => {
    search($('#search').val().toLowerCase());
});

$(window).on('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    $('#search').val(urlParams.get('q'));
    search($('#search').val().toLowerCase());
});
