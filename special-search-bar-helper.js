function specialSearchBarHelper () {
    const hoverAreaSelector = '.pagenav';
    const styleTag = document.createElement('style');
    const styles =`
        .pointer-wrapper {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
        }

        .pointer-wrapper .pointer__forearm {
            display: block;
            position: absolute;
            width: 1332px;
            height: 500px;
            left: 100%;
            top: 0;
            margin-top: -158px;
            transform: translateY(100vh) rotate(45deg);
            transition: transform 1s cubic-bezier(0.83, 0, 0.17, 1), margin 1s cubic-bezier(0.83, 0, 0.17, 1);
            animation-name: pointy;
            animation-duration: .5s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-delay: 1s;
        }

        .pointer__image {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .pointer__image--thumbs-up {
            display: none;
        }

        .js-used-search .pointer__image--thumbs-up {
            display: block;
        }

        .js-used-search .pointer__image--finger-point {
            display: none;
        }


        @keyframes pointy {
            0% {
                margin-left: 0;
            }
            50% {
                margin-left: 20px;
            {
            100% {
                margin-left: 0;
            }
        }
    `;
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);

    const searchInput = document.querySelectorAll('.pagenav__search-input')[0];

    if (searchInput) {
        const hoverTime = 5000;
        const armImageUrls = {
            forearm: 'https://cdn.jsdelivr.net/gh/marshallcrosby/tampermonkey-scripts@latest/images/forearm.png',
            thumbsUp: 'https://cdn.jsdelivr.net/gh/marshallcrosby/tampermonkey-scripts@latest/images/thumbs-up.png',
            fingerPoint: 'https://cdn.jsdelivr.net/gh/marshallcrosby/tampermonkey-scripts@latest/images/finger-point.png'
        };

        const pointerElement = document.createElement('div');
        const pointerElementChildrenImages = `
            <img class="pointer__image pointer__image--forearm" src="${armImageUrls.forearm}">
            <img class="pointer__image pointer__image--finger-point" src="${armImageUrls.fingerPoint}">
            <img class="pointer__image pointer__image--thumbs-up" src="${armImageUrls.thumbsUp}">
        `;
        pointerElement.classList.add('pointer__forearm');
        pointerElement.innerHTML = pointerElementChildrenImages;

        const pointerWrapper = document.createElement('div');
        pointerWrapper.classList.add('pointer-wrapper');
        pointerWrapper.appendChild(pointerElement);
        document.body.appendChild(pointerWrapper);

        const hoverAreaElement = document.querySelector(hoverAreaSelector);
        let hoverInterval = null;

        hoverAreaElement.addEventListener('mouseenter', () => {
            if (!document.body.classList.contains('js-used-search')) {
                hoverInterval = window.setInterval(() => {
                    setPointyLoc();
                    document.addEventListener('scroll', setPointyLoc);
                    window.addEventListener('resize', setPointyLoc);
                }, hoverTime);
            }
        });

        hoverAreaElement.addEventListener('mouseleave', () => {
            window.clearInterval(hoverInterval);
            removePointyLoc();
            document.removeEventListener('scroll', setPointyLoc);
            window.removeEventListener('resize', setPointyLoc);
        });

        const searchInput = document.querySelector('.pagenav__search-input');

        searchInput.addEventListener('focus', () => {
            window.clearInterval(hoverInterval);
            removePointyLoc();
            document.removeEventListener('scroll', setPointyLoc);
            window.removeEventListener('resize', setPointyLoc);

            document.body.classList.add('js-used-search');
        });

        function setPointyLoc() {
            const searchRect = searchInput.getBoundingClientRect();
            document.body.classList.add('js-search-pointy-active');
            pointerElement.style.top = searchRect.top + 'px';
            pointerElement.style.transform = 'translateX(' + ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - searchRect.right) * -1 + 'px)';
        }

        function removePointyLoc() {
            document.body.classList.remove('js-search-pointy-active');
            pointerElement.style.transform = null;
        }
    }
}