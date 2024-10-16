$(function(){

	function replaceHTMLWithHTMLFile(file, finish) {
		$.get(file, function(data) {
		     $("html").html(data);
		     finish();
		}); 
	};

	function replaceHTMLTagWithHTML(tag, file, finish) {
		$.get(file, function(data) {
		     $(tag)[0].innerHTML = data;
		     finish();
		}); 
	};

	function appendHTMLTagWithHTML(tag, file, finish) {
		$.get(file, function(data) {
		     $(tag)[0].innerHTML += data;
		     finish();
		}); 
	};

	function replaceDivWithHTMLFile(id, file, finish) {
		$.get(file, function(data) {
		    $(id).replaceWith(data);
		    finish();
		}); 
	};

	function replaceDivWithHTMLElement(id, element) {
		$(id).replaceWith($(element).detach().html());
	};

	function setLastModifiedOn(elementId) {
		let locale = 'en-CA';
		var lastModifiedDate = new Date(document.lastModified);
		var lastModifiedDateString = lastModifiedDate.toLocaleDateString(locale);
		document.getElementById(elementId).innerHTML = lastModifiedDateString;
	};

	// get non-authenticated downloadable url and set it as the elementId's innerHTML 
	function getUrlAndSet(url, elementId) {
		$.get(url)
		.done(function(result) {
			document.getElementById(elementId).innerHTML = result;
		})
		.fail(function(error){
			console.log(error);
		});
	};

	function setTitleWithElement(elementId, titleElementId) {
		let title = document.getElementById(elementId).innerHTML; 
		document.title = title;
		document.getElementById(titleElementId).innerHTML = title;
		document.getElementById(elementId).remove();
	};

	// load all images in imageDirectoryPath and append it to imageContainer 
	function getImageDirectoryAndLoadImages(imageDirectoryPath, imageContainer) {
		var imagePaths = [];

		$.get(imageDirectoryPath)
		.done(function(result) {
			// get image paths from index page 
			let html = $.parseHTML(result);
			$.each(html, function( i, el ) {
				if (el.tagName == "UL") {
					let listItems = $(el).find("li");
					$.each(listItems, function(i, item) {
						let imagePath = $("a", item).attr('href');
						imagePaths.push(imagePath);
					});
				}
			});

			// clear html of div
			document.getElementById(imageContainer).innerHTML = "";

			// load each image and add to imageContainer 
			$.each(imagePaths, function(i, imagePath) {
				// prepend directory path 
				let fullImagePath = imageDirectoryPath + "/" + imagePath;
				console.log(fullImagePath);

				$('<img src="'+ fullImagePath +'">').on('load', function() {
					$(this).width(100).appendTo("#" + imageContainer);
				});
			});
		})
		.fail(function(error){
			console.log(error);
		});
	};

	function loadTemplate() {
		// load the template's html sections, then replace the content body with this page's content 
		//	#template-<section> 
		//   #content-body-placeholder 
		replaceDivWithHTMLFile("#template-banner", "/template/sections/banner.html");
		replaceDivWithHTMLFile("#template-navbar", "/template/sections/navbar.html");
		replaceDivWithHTMLFile("#template-content", "/template/sections/content.html", function() {
			setTitleWithElement("page-title", "content-title-placeholder");
			replaceDivWithHTMLElement("#content-body-placeholder", "#body-content");
		});
		replaceDivWithHTMLFile("#template-footer", "/template/sections/footer.html");
		replaceDivWithHTMLFile("#template-corners", "/template/sections/corners.html", function() {
			setLastModifiedOn("corner-bottom-left"); 
		});

		getUrlAndSet(
			"https://dl.dropbox.com/scl/fi/us6gn43hurmry2nlbcw3u/test.txt?rlkey=620tf3x71becx5d4g357khbee&e=1&st=vgis3gsx&dl=1",
			"file-test-txt");

		getImageDirectoryAndLoadImages(
			"/images/main/test",
			"images-test");
	}

	replaceHTMLTagWithHTML("head", "/template/head.html", function() {
		let pageContentLocation = document.getElementById("page-content-location").innerHTML;
		replaceHTMLTagWithHTML("body", "/template/body.html", function() {
			appendHTMLTagWithHTML("body", pageContentLocation, function() {
				loadTemplate();
			});
		});
	});

	// loadTemplate(); 
});
