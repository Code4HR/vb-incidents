$( function () {

	var neighborhoods;
	$.ajax( {
		async: false,
		dataType: "json",
		url: "/neighborhoods",
		type: "GET",
		success: function ( data ) {
			neighborhoods = data;
		}
	});

	// setup autocomplete function pulling from currencies[] array
	$( '#autocomplete' ).autocomplete( {
		lookup: neighborhoods,
		onSelect: function ( suggestion ) {
			//var thehtml = '<strong>Currency Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
			//$('#outputcontent').html(thehtml);
		}
	});
});

//$(function () {

//  $("#search-query").autocomplete({j
//      source: function (request, response) {
//         $.ajax({
//            url: "/search_neighborhood",
//            type: "GET",
//            data: request,  // request is the value of search input
//            success: function (data) {
//              // Map response values to field label and value
//               response($.map(data, function (el) {
//                  return {
//                     label: el.Location.Neighborhood,
//                     value: el._id
//                  };
//                  }));
//               }
//            });
//         },

//         // The minimum number of characters a user must type before a search is performed.
//         minLength: 3, 

//         // set an onFocus event to show the result on input field when result is focused
//         focus: function (event, ui) { 
//            this.value = ui.item.label; 
//            // Prevent other event from not being executed
//            event.preventDefault();
//         },
//         select: function (event, ui) {
//            // Prevent value from being put in the input:
//            //this.value = ui.item.label;
//            // Set the id to the next input hidden field
//            $(this).next("input").val(ui.item.value); 
//            // Prevent other event from not being execute            
//            event.preventDefault();
//            // optional: submit the form after field has been filled up
//            $('#quicksearch').submit();
//         }
//  });

//});