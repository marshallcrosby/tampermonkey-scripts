// ==UserScript==
// @name         Blend Support Enhancment Suite
// @namespace    https://marshallcrosby.com/
// @version      0.2.7
// @description  Attempt to make Redmine a little more enjoyable to use.
// @author       Marshall
// @match        *support.blendinteractive.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('DOMContentLoaded', function() {


        /*-------------------------------------------------------------------------
            Create style tag, populate it and throw it up in the <head> tag
        -------------------------------------------------------------------------*/

        let styleTag = document.createElement('style');
        let styleDecs = /* css */`
            :root {
                --color-utility-bg: #efefef;
                --color-utility-bg-hover: #e5e4e4;
                --color-text-common: #4b4b4b;
                --size-touch-common: 30px;
            }

            .js-video {
                position: relative;
                width: 100%;
                max-width: 576px;
                margin-top: 30px;
                margin-bottom: 30px;
                border: 1px solid #e3e3e3;
                aspect-ratio: 16 / 9;
            }

            .js-video__item {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .js-img-gallery {
                display: flex;
                flex-wrap: wrap;
                margin-right: -10px;
                margin-left: -10px;
            }

            .js-img-gallery__item {
                position: relative;
                overflow: hidden;
                flex: 0 0 50%;
                width: 50%;
                max-width: 200px;
                padding: 10px;
                transition: transform 200ms ease;
            }

            .js-img-gallery__item:hover {
                transform: translateY(-3px);
            }

            @media (min-width: 768px) {
                .js-img-gallery__item {
                    flex: 0 0 25%;
                    width: 25%;
                }
            }

            .js-img-gallery__link {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                /*border: 1px solid #e3e3e3;*/
                margin-bottom: 5px;
                aspect-ratio: 1 / 1;
                /*border-radius: 5px;*/
            }

            .js-img-gallery__img {
                display: block;
                width: 100%;
                height: 100%;
                margin: 0 auto;
                object-fit: cover;
            }

            .js-img-gallery__meta,
            .js-img-gallery__meta tbody,
            .js-img-gallery__meta tbody tr,
            .js-img-gallery__meta tbody td {
                display: block;
                font-size: 11px;
            }

            .js-img-gallery__meta {
                position: relative;
            }

            .js-img-gallery__meta .icon-attachment {
                padding-left: 0;
                white-space: nowrap;
                background-image: none;
                font-size: 12px;
                font-weight: bold;
            }

            .js-img-gallery__meta td:empty,
            .js-img-gallery__meta .size {
                display: none;
            }

            .js-img-gallery__meta td:first-child {
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .js-img-gallery__meta .delete,
            .js-img-gallery__meta .icon-download {
                position: absolute;
                right: 5px;
                bottom: calc(100% + 10px);
                display: flex;
                overflow: hidden;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                padding: 0;
                transition: opacity 150ms linear;
                text-indent: 200px;
                opacity: 0;
                color: rgba(36,38,44,1);
                border-radius: 3px;
                background-color: #eee;
                background-position: center center;
                font-size: 0;
            }

            .js-img-gallery__meta .icon-download {
                right: auto;
                left: 5px;
            }

            .js-img-gallery__item:hover .icon-download,
            .js-img-gallery__item .icon-download:focus,
            .js-img-gallery__item:hover .delete,
            .js-img-gallery__item .delete:focus {
                opacity: 1;
            }

            .js-img-gallery__meta .icon-download:hover,
            .js-img-gallery__meta .delete:hover {
                background-color: #dadada;
            }

            .js-img-item {
                margin-bottom: 10px;
            }

            .js-img-item > * {
                vertical-align: text-top;

                font-size: 0;
            }

            .js-img-item .icon-only.icon-download {
                display: none;
            }

            .js-img-link {
                display: inline-flex;
                align-items: center;
                font-size: 12px;
                font-weight: bold;
            }

            .js-img-link__img {
                width: 100%;
                max-width: 70px;
                height: 100%;
                max-height: 70px;
                margin-right: 10px;
                aspect-ratio: 1 / 1;
                object-fit: cover;
            }

            .js-modal-open {
                overflow: hidden;
            }

            .js-modal-open .js-modal,
            .js-modal-open .js-modal-backdrop {
                display: block;
            }

            .js-modal {
                position: fixed;
                z-index: 10055;
                top: 0;
                left: 0;
                display: none;
                overflow-x: hidden;
                overflow-y: auto;
                width: 100%;
                height: 100%;
                pointer-events: none;
                outline: 0;
            }

            .js-modal__dialog {
                position: relative;
                display: flex;
                align-items: center;
                width: auto;
                min-height: calc(100% - 1rem);
                margin: 0.5rem;
                pointer-events: none;
            }

            .js-modal__content {
                display: flex;
                flex-direction: column;
                width: auto;
                margin-right: auto;
                margin-left: auto;
                pointer-events: auto;
                border-radius: 0.3rem;
                outline: 0;
                background-clip: padding-box;
            }

            .js-modal__header {
                display: flex;
                align-items: center;
                flex-shrink: 0;
                justify-content: space-between;
                padding: 0 2rem;
                border-top-left-radius: calc(0.3rem - 1px);
                border-top-right-radius: calc(0.3rem - 1px);
                z-index: 1;
            }

            .js-modal__title {
                margin-right: 20px;
                color: #fff;
                font-size: 12px;
                backdrop-filter: blur(2px);
            }

            .js-btn__close {
                height: var(--size-touch-common);
                margin-left: auto;
                margin-right: -10px;
                padding: 0 15px;
                border: 0;
                border-radius: 5px;
                background-color: transparent;
                opacity: .7;
            }

            .js-btn__close path {
                stroke: #fff;
            }

            .js-btn__close:hover {
                opacity: 1;
            }

            .js-modal__body {
                flex: 1 1 auto;
                padding: 1rem 2rem;
            }

            .js-modal__body img {
                display: block;
                width: auto;
                max-width: 100%;
                height: auto;
                max-height: 90vh;
                margin-right: auto;
                margin-left: auto;
            }

            .js-modal__prev,
            .js-modal__next {
                position: absolute;
                top: calc(50% - 40px);
                left: -10px;
                width: 40px;
                height: 80px;
                background-color: transparent;
                border: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: .7;
            }

            .js-modal__next {
                left: auto;
                right: -10px;
            }

            .js-modal__prev path,
            .js-modal__next path {
                stroke: #fff;
            }

            .js-modal__next svg {
                transform: rotate(180deg);
            }

            .js-modal__prev:hover,
            .js-modal__next:hover {
                opacity: 1;
            }

            .js-modal button[disabled] {
                opacity: .1;
            }

            .js-modal-backdrop {
                position: fixed;
                z-index: 10050;
                top: 0;
                left: 0;
                display: none;
                width: 100vw;
                height: 100vh;
                background-color: rgb(0, 0, 0, .75);
            }
        `;
        styleTag.textContent = styleDecs;
        document.head.appendChild(styleTag);


        /*-------------------------------------------------------------------------
            Create modal element(s) and append it to body
        -------------------------------------------------------------------------*/

        let chevronSVG = /* html */`
            <svg width="15" height="37" viewBox="0 0 22 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9688 2.00049L2.99825 18.5843L19.9688 35.168" stroke="#1A1A1A" stroke-width="4"></path>
            </svg>
        `;
        let closeSVG = /* html */`
            <svg width="14" height="14" viewBox="0 0 18 17.7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="st0" d="M17.1,1L9,8.8l8.1,7.9" stroke="#1A1A1A" stroke-width="4"/>
                <path class="st0" d="M1,16.8L9,8.9L1,1" stroke="#1A1A1A" stroke-width="4"/>
            </svg>
        `;
        let modalHtml = /* html */`
            <div class="js-modal__dialog">
                <div class="js-modal__content">
                    <div class="js-modal__header">
                        <div class="js-modal__title"></div>
                        <button class="js-btn__close" type="button" aria-label="Close">
                            ${closeSVG}
                        </button>
                    </div>
                    <div class="js-modal__body">
                        <div class="js-modal__media">Modal body text goes here.</div>
                        <button class="js-modal__prev" aria-label="Previous">
                            ${chevronSVG}
                        </button>
                        <button class="js-modal__next" aria-label="Next">
                            ${chevronSVG}
                        </button>
                    </div>
                </div>
            </div>
        `;
        let modalEl = document.createElement('div');
        modalEl.classList.add('js-modal');
        modalEl.setAttribute('tabindex', '-1');
        modalEl.innerHTML = modalHtml;

        let modalBackdropEl = document.createElement('div');
        modalBackdropEl.classList.add('js-modal-backdrop');

        document.body.appendChild(modalEl);
        document.body.appendChild(modalBackdropEl);


        // Start using jquery from here on out because I'm lazy
		(function ($) {


            /*-------------------------------------------------------------------------
                Make attachments and external links open in new window
            -------------------------------------------------------------------------*/

            $('.external, .icon-attachment, .icon-download').each(function () {
                $('[href="' + $(this).attr('href') + '"]')
                    .attr('target', '_blank')
                    .attr('rel', 'noopener noreferrer');
            });


            /*-------------------------------------------------------------------------
                Create video player from video file link
            -------------------------------------------------------------------------*/

            let videoAttachment = $(`
                a.icon-attachment[href*=".mp4"],
                a.icon-attachment[href*=".MP4"],
                a.icon-attachment[href*=".mov"],
                a.icon-attachment[href*=".MOV"],
                a.icon-attachment[href*=".mpg"],
                a.icon-attachment[href*=".MPG"],
                a.icon-attachment[href*=".avi"],
                a.icon-attachment[href*=".AVI"],
                a.icon-attachment[href*=".ogg"],
                a.icon-attachment[href*=".OGG"],
                .has-details .details a[href*=".mp4"]:not(.icon-download),
                .has-details .details a[href*=".MP4"]:not(.icon-download),
                .has-details .details a[href*=".mov"]:not(.icon-download),
                .has-details .details a[href*=".MOV"]:not(.icon-download),
                .has-details .details a[href*=".mpg"]:not(.icon-download),
                .has-details .details a[href*=".MPG"]:not(.icon-download),
                .has-details .details a[href*=".avi"]:not(.icon-download),
                .has-details .details a[href*=".AVI"]:not(.icon-download),
                .has-details .details a[href*=".ogg"]:not(.icon-download),
                .has-details .details a[href*=".OGG"]:not(.icon-download)
            `);

            if (videoAttachment.length) {
                videoAttachment.each(function () {
                    let $this = $(this);
                    let hrefSplice = $this.attr('href').split('/attachments/').join('/attachments/download/');

                    $this.attr('href', hrefSplice);

                    $(`
                     <div class="js-video">
                        <video class="js-video__item" controls>
                            <source src="${hrefSplice}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    `).insertAfter($this.closest('table, .details'));
                });
            }


            /*-------------------------------------------------------------------------
                Cache some elements to use for the image gallery stuff up next
            -------------------------------------------------------------------------*/

            let $body = $('body');
            let modal = $(modalEl);
            let modalTitle = modal.find('.js-modal__title');
            let modalMedia = modal.find('.js-modal__media');
            let modalCloseElements = $('.js-modal-backdrop, .js-btn__close');
            let modalNavButtons = modal.find('.js-modal__prev, .js-modal__next');


            /*-------------------------------------------------------------------------
                Create image gallery from picture attachments up in the details pane
            -------------------------------------------------------------------------*/

            let imgAttachment = $(`
                a.icon-attachment[href*=".jpg"],
                a.icon-attachment[href*=".JPG"],
                a.icon-attachment[href*=".jpeg"],
                a.icon-attachment[href*=".JPEG"],
                a.icon-attachment[href*=".gif"],
                a.icon-attachment[href*=".GIF"],
                a.icon-attachment[href*=".png"],
                a.icon-attachment[href*=".PNG"],
                a.icon-attachment[href*=".webp"],
                a.icon-attachment[href*=".WEBP"]
            `).not('[href*=".zip"]');

            if (imgAttachment.length) {
                let galleryHtml = $(`<div class="js-img-gallery"></div>`);

                galleryHtml.insertAfter($('.details .attachments'));

                let tableRow = $('.attachments table tbody tr');

                imgAttachment.each(function (index) {
                    let $picture = $(this);
                    let hrefSplice = $picture.attr('href').split('/attachments/').join('/attachments/download/');

                    $picture.attr('title', $picture.text());

                    let jsImageItem = $(`
                        <div class="js-img-gallery__item">
                            <a class="js-img-gallery__link" href="${$picture.attr('href')}" target="_blank" title="${$picture.text()}">
                                <img class="js-img-gallery__img" src="${hrefSplice}">
                            </a>
                            <table class="js-img-gallery__meta">
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    `).appendTo(galleryHtml);

                    //tableRow.eq(index).clone().appendTo(jsImageItem.find('table tbody'));
                    tableRow.eq(index).appendTo(jsImageItem.find('table tbody'));

                    // Open modal and populate with currently clicked image link
                    jsImageItem.find('.js-img-gallery__link').on('click', function (e) {
                        e.preventDefault();

                        // Open modal
                        $body.addClass('js-modal-open');

                        // Set amount data attribute
                        modal.attr('data-img-amount', $(this).closest('.js-img-gallery').find('.js-img-gallery__item').length);

                        var attachmentTitle = $(this).closest('.js-img-gallery__item').find('.js-img-gallery__meta td a').first().text();
                        var attachmentSize = $(this).closest('.js-img-gallery__item').find('.js-img-gallery__meta td .size').first().text();
                        var attachmentAuthor = $(this).closest('.js-img-gallery__item').find('.js-img-gallery__meta .author').text();

                        // Populate modal
                        modalTitle.html('<strong>' + attachmentTitle + '</strong> ' + attachmentSize + '<br>' + attachmentAuthor);
                        modalMedia.html('<img src="' + $(this).find('.js-img-gallery__img').attr('src') + '">');

                        // Assign current indexes (for navigation)
                        modalNavButtons.attr({
                            'data-current-group-index': $(this).closest('.js-img-gallery').attr('data-group-index'),
                            'data-current-img-index': $(this).attr('data-nav-index')
                        });

                        // Fire an event
                        modal.trigger($.Event('modalShowing'));
                    });
                });
            }


            /*-------------------------------------------------------------------------
                Create thumbnail view of image attachments in single threads
            -------------------------------------------------------------------------*/

            let imgLink = $(`
                a[href*=".jpg"],
                a[href*=".JPG"],
                a[href*=".jpeg"],
                a[href*=".JPEG"],
                a[href*=".gif"],
                a[href*=".GIF"],
                a[href*=".png"],
                a[href*=".PNG"],
                a[href*=".webp"],
                a[href*=".WEBP"]
            `);

            $('ul.details > li').find(imgLink).not('.icon-only, [href*=".zip"]').each(function () {
                let $imgLink = $(this);
                let hrefSplice = $imgLink.attr('href').split('/attachments/').join('/attachments/download/');

                $imgLink
                    .closest('ul')
                    .addClass('js-img-list')
                    .end()
                    .closest('li')
                    .addClass('js-img-item')
                    .find('strong')
                    .first()
                    .remove();

                $imgLink
                    .addClass('js-img-link')
                    .attr('title', $imgLink.text())
                    .prepend('<img class="js-img-link__img" src="' + hrefSplice +'">');

                $imgLink.closest('li')
                    .html($imgLink);

                $imgLink.on('click', function (e) {
                    e.preventDefault();

                    // Open modal
                    $body.addClass('js-modal-open');

                    // Set amount data attribute
                    modal.attr('data-img-amount', $(this).closest('.js-img-list').find('.js-img-item').length);

                    // Populate modal
                    modalTitle.html('<strong>' + $(this).text() + '</strong>');
                    modalMedia.html('<img src="' + $(this).find('img').attr('src') + '">');

                    // Assign current indexes (for navigation)
                    modalNavButtons.attr({
                        'data-current-group-index': $(this).closest('.js-img-list').attr('data-group-index'),
                        'data-current-img-index': $(this).attr('data-nav-index')
                    });

                    // Fire an event
                    modal.trigger($.Event('modalShowing'));
                });
            });


            /*-------------------------------------------------------------------------
                Setup modal navigation inside groups of images
            -------------------------------------------------------------------------*/

            // Assign data attr values to group and image links (inside group)
            $('.js-img-gallery, .js-img-list').each(function (index) {
                let $group = $(this);

                $group
                    .addClass('js-img-group-' + index)
                    .attr('data-group-index', index)
                    .find('.js-img-gallery__img, .js-img-link__img').each(function (index) {
                        $(this)
                            .closest('a')
                            .attr('data-nav-index', index);
                    });
            });

            // Previou/Next button click functionality
            modalNavButtons.on('click', function (index) {
                let $activeButton = $(this);
                let currentGroupElement = $('[data-group-index="' + $activeButton.attr('data-current-group-index') + '"]');
                let currentItemIndex = currentGroupElement.find('[data-nav-index="' + $activeButton.attr('data-current-img-index') +'"]').attr('data-nav-index');
                let groupItemCount = currentGroupElement.find('[data-nav-index]').length;
                let goToThisItem;

                if ($activeButton.is('.js-modal__prev')) {
                    goToThisItem = (currentItemIndex === '0') ? (groupItemCount - 1) : currentItemIndex - 1;
                } else if ($activeButton.is('.js-modal__next')) {
                    goToThisItem = (parseInt(currentItemIndex) === (groupItemCount - 1)) ? '0' : parseInt(currentItemIndex) + 1;
                }

                // Close the modal (only to be opened again)
                $body.removeClass('js-modal-open');

                // Trigger prev/next modal item
                currentGroupElement.find('[data-nav-index="' + goToThisItem +'"]').trigger('click');

                // Fire an event
                modal.trigger($.Event('modalNavDone'));
            });


            /*-------------------------------------------------------------------------
                Set modal nav buttons state
            -------------------------------------------------------------------------*/

            modal.on('modalNavDone modalShowing', function () {
                let navButtons = modal.find('.js-modal__prev, .js-modal__next');
                let prevButton = modal.find('.js-modal__prev');
                let nextButton = modal.find('.js-modal__next');

                // Disable nav if only one item
                if (modal.attr('data-img-amount') === '1') {
                   navButtons
                        .attr('disabled', 'disabled')
                        .css('opacity', '0');
                } else {
                    navButtons
                        .removeAttr('disabled')
                        .css('opacity', '');
                }

                // Disable previous button if beginning reached
                if (parseInt(modal.find('.js-modal__prev').first().attr('data-current-img-index')) === 0) {
                    prevButton.attr('disabled', 'disabled');
                } else {
                    prevButton.removeAttr('disabled');
                }

                // Disable next button if end reached
                if (parseInt(modal.attr('data-img-amount')) === parseInt(modal.find('.js-modal__next').first().attr('data-current-img-index')) + 1) {
                    nextButton.attr('disabled', 'disabled');
                } else {
                    nextButton.removeAttr('disabled');
                }
            });


            /*-------------------------------------------------------------------------
                Close modal with close button or click outside
            -------------------------------------------------------------------------*/

            modalCloseElements.on('click', function () {
                $body.removeClass('js-modal-open');
            });


            /*-------------------------------------------------------------------------
                Keyboarding
            -------------------------------------------------------------------------*/

            $(document).on('keydown', function(event) {

                // Close modal on escape press
                if (event.key === 'Escape') {
                    $body.removeClass('js-modal-open');
                }

                // Left/Right arrow keys to navigation modal entries
                if ($body.hasClass('js-modal-open')) {
                    if (event.key === 'ArrowLeft') {
                        $('.js-modal__prev')
                            .not('[disabled]')
                            .click();
                    } else if (event.key === 'ArrowRight') {
                        $('.js-modal__next')
                            .not('[disabled]')
                            .click();
                    }
                }
            });
		}(jQuery));
	});
})();