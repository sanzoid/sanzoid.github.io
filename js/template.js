$(function(){

	loadTemplate(function() {
		getUrlAndSet(
			"https://dl.dropbox.com/scl/fi/us6gn43hurmry2nlbcw3u/test.txt?rlkey=620tf3x71becx5d4g357khbee&e=1&st=vgis3gsx&dl=1",
			"file-test-txt");

		getImageDirectoryAndLoadImages(
			"/images/main/test",
			"images-test");
	});
	
});

/* UTILITIES */

// get the last modified date of the document
function getLastModifiedDate() {
	return new Date(document.lastModified);
};

// set the last modified date on element with `elementId`
function setLastModifiedOn(elementId) {
	var lastModifiedDate = getLastModifiedDate(); 
	let locale = 'en-CA';
	var lastModifiedDateString = lastModifiedDate.toLocaleDateString(locale);
	document.getElementById(elementId).innerHTML = lastModifiedDateString;
};

// load all images in `imageDirectoryPath`` and append it to `imageContainer``
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

// set document `title` and `titleElementId` using the content of `elementId`
// removes `elementId` when done 
function setTitleWithElement(titleElementId, elementId) {
	let title = document.getElementById(elementId).innerHTML; 
	document.title = title;
	document.getElementById(titleElementId).innerHTML = title;
	document.getElementById(elementId).remove();
};

// get downloadable url (no auth) and set it as the `elementId`'s content 
function getUrlAndSet(url, elementId) {
	$.get(url)
	.done(function(result) {
		document.getElementById(elementId).innerHTML = result;
	})
	.fail(function(error){
		console.log(error);
	});
};

/* DOM Manipulation */

function modifyHTMLTagWithHTMLInFile(tag, file, shouldAppend, finish) {
	$.get(file, function(data) {
		if (shouldAppend) {
			$(tag)[0].innerHTML += data;
		} else {
			$(tag)[0].innerHTML = data;

		}
		finish();
	}); 
};

function replaceElementWithHTMLFile(id, file, finish) {
	$.get(file, function(data) {
		$(id).replaceWith(data);
		finish();
	}); 
};

function replaceElementWithHTMLElement(id, element) {
	$(id).replaceWith($(element).detach().html());
};

/* Template */

let headTemplateFilePath = "/template/head.html";
let bodyTemplateFilePath = "/template/body.html";
let bodyContentLocationId = "page-content-location";

let templateFilePathBanner = "/template/sections/banner.html";
let templateFilePathNavbar = "/template/sections/navbar.html";
let templateFilePathContent = "/template/sections/content.html";
let templateFilePathFooter = "/template/sections/footer.html";
let templateFilePathCorners = "/template/sections/corners.html";

let templateIdBanner = "#template-banner";
let templateIdNavbar = "#template-navbar";
let templateIdContent = "#template-content";
let templateIdFooter = "#template-footer";
let templateIdCorners = "#template-corners";

let templateIdTitle = "content-title-placeholder";
let templateIdContentBody = "#content-body-placeholder"; // TODO: remove # 
let templateIdCornerBottomLeft = "corner-bottom-left";

let contentIdTitle = "page-title";
let contentIdContentBody = "#body-content";

function loadTemplate(finish) {
	loadHead(function() {
		loadBody(finish);
	});
};

function loadHead(finish) {
	modifyHTMLTagWithHTMLInFile("head", headTemplateFilePath, false, function() {
		finish();
	});
};

function loadBody(finish) {
	let bodyContentLocation = document.getElementById(bodyContentLocationId).innerHTML;
	modifyHTMLTagWithHTMLInFile("body", bodyTemplateFilePath, false, function() {
		loadBodyContent(bodyContentLocation, finish);
	});
};

function loadBodyContent(bodyContentLocation, finish) {
	modifyHTMLTagWithHTMLInFile("body", bodyContentLocation, true, function() {
		loadTemplateSections(finish);
	});
};

function loadTemplateSections(bodyFinish) {
	// load the template's html sections, then replace the content body with this page's content 
	replaceElementWithHTMLFile(templateIdBanner, templateFilePathBanner);
	replaceElementWithHTMLFile(templateIdNavbar, templateFilePathNavbar);
	replaceElementWithHTMLFile(templateIdContent, templateFilePathContent, function() {
		setTitleWithElement(templateIdTitle, contentIdTitle);
		replaceElementWithHTMLElement(templateIdContentBody, contentIdContentBody);

		bodyFinish();
	});
	replaceElementWithHTMLFile(templateIdFooter, templateFilePathFooter);
	replaceElementWithHTMLFile(templateIdCorners, templateFilePathCorners, function() {
		setLastModifiedOn(templateIdCornerBottomLeft); 
	});
};
