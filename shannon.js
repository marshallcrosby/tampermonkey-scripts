// ==UserScript==
// @name         Shannan.js
// @namespace    http://blendinteractive.com/
// @version      0.1
// @description  Watch ticket after assigning from "New" to a different status
// @author       You
// @match        https://support.blendinteractive.com/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blendinteractive.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function autoWatchTicket() {
        const changeFromStatus = 'New';
        const statusEl = document.querySelector('.attributes .splitcontent .status .value');
        const watchButton = document.querySelector('[href*="/watchers/watch?"]');
        let loadStatus;
        let editSubmitBtn;

        document.addEventListener('change', function () {
            $(document).ajaxSuccess(function() {
                loadStatus = statusEl.innerText.toLowerCase();
                editSubmitBtn = document.querySelector('#update .edit_issue [value="Submit"]');

                editSubmitBtn.addEventListener('click', function (event) {
                    if (
                        loadStatus === changeFromStatus.toLowerCase() &&
                        changeFromStatus.toLowerCase() !== document.querySelector('#issue_status_id').selectedOptions[0].text.toLowerCase() &&
                        watchButton.innerText.toLowerCase() === 'watch'
                    ) {
                        event.preventDefault();

                        watchButton.click();

                        this.closest('form').submit();
                    }
                });
            });
        });
    }

    window.addEventListener('load', autoWatchTicket);
})();