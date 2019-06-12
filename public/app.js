

let scrape = () => { 
    console.log("scrape started!");
    window.location.replace('/scrape');
};
$('.scrape').on('click', scrape);

$('.aList').children().children().children().on('click', function(e) {
    e.preventDefault();

    // $(this).parent().parent().css('color', 'red');

    console.log('clicked');
    let headline = {
        title: $(this).parent().parent().text().trim(),
        id: $(this).attr('data-id')
    }
    console.log(headline);
    if($(this).attr('class') === 'delBtn'){
        $.ajax('/delete', {
            type: 'DELETE',
            data: headline
        }).then(() => {
            console.log('headline deleted');
            window.location.reload();
        });
    }
    else if ($(this).attr('class') === 'comBtn'){
        $('.ninja').fadeIn().css('display', 'grid');
        window.location.replace(`/comment/${headline.id}`);
    }
    else{
        $(this).parent().html('<i class="fas fa-skull saveBtn skull"></i>');
        $.ajax('/api/headline', {
            type: 'POST',
            data: headline
        }).then(() => {
            
            console.log("Saved Headline")
        });
    }
});

$('.saved').on('click', () => {
    console.log('fetch saved headlines');
    window.location.replace('/');
})

$('.smBtn').on('click', () => {
    window.location.replace('/deleteAll');
});

$('#close').on('click', () => {
    console.log('close modal clicked')
    $('.ninja').fadeOut();
    window.location.replace('/');
})

$('#view').on('click', () => {
    console.log('view was clicked')
    $('#commentForm').fadeOut();
    $('#view').fadeOut();
    setTimeout(() => {
        $('#commentView').fadeIn().css('display', 'grid');
        $('#writeC').fadeIn().css('display', 'grid');
    }, 300);
});
$('#writeC').on('click', () => {
    console.log('writeC was clicked')
    $('#commentForm').fadeIn().css('display', 'grid');
    $('#writeC').fadeOut();
    setTimeout(() => {
    $('#view').fadeIn().css('display', 'grid');
    }, 300);
})

$('#commentBtn').on('click', (e) => {
    // e.preventDefault();
    let b = $('#commentBody').val().trim();
    let id = $('#commentBtn').attr('data-id');
    let bObj = { id: id, body: b }
    console.log('form comment clicked')
    console.log(`this is the b value before if statemnt: ${b}`);
    if( b === ''){
        alert('please enter a comment')
    }
    else{
        $.ajax('/submit', {
            type: 'POST',
            data: bObj
        }).then(() => {
            console.log('comment posted to db')
        })
    }
})