import { useEffect, useRef } from 'react';

const IconoRacha = () => {
    const btnRef = useRef(null);

    const triggerFire = () => {
        const btn = btnRef.current;
        if (!btn) return;
        btn.classList.remove('is-active');
        void btn.offsetWidth;
        btn.classList.add('is-active');
        setTimeout(() => btn.classList.remove('is-active'), 850);
    };

    return (
        <button
            ref={btnRef}
            className="app-icon app-icon--fire"
            type="button"
            aria-label="Racha"
            data-icon="fire"
            onClick={triggerFire}
        >
            <svg className="icon-svg"  viewBox="0 0 31 37" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                    <filter id="flame-wobble" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04 0.09" numOctaves="2" seed="3" result="noise">
                            <animate attributeName="baseFrequency" dur="0.9s" values="0.035 0.08;0.055 0.12;0.03 0.09;0.045 0.07;0.035 0.08" repeatCount="indefinite"/>
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.4" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                </defs>
                <g className="fire-body" filter="url(#flame-wobble)">
                    <path className="fire-layer fire-layer--outer" d="M26.5 21.5C26.5 27.299 20.9036 32 14 32C7.09645 32 1.50001 27 1.50001 21.5C1.50001 15.701 7.09645 11 14 11C20.9036 11 26.5 15.701 26.5 21.5Z" fill="#FD3C4F"/>
                    <path className="fire-layer fire-layer--tip-r" d="M20 12.5L20.5 12H21L21.5 11.5L22 10L22 10.5L22.5 9.5L23 8.5L23 9L23.5 8L24.5 9.5L25.5 10.5L26 11.5L27 13L27.5 15L28 18V20.5L27.5 22L26.5 24L25.5 26L26 21L25 17L22.5 14L20 12.5Z" fill="#FD3C4F"/>
                    <path className="fire-layer fire-layer--tip-l" d="M13.5 1L14.5 0L16 1L16 0.5L17 2.5L17.5 3L18 3.5L18 3L19 4.5L19.5 5V4.5L20.5 6.5L21 7.5V8.25V9V10.5L20.5 12.5L15.5 11.5H10.5L7.00001 13L3.50001 16L2.50001 25.5L1.50001 24L1.00001 22.5L0.500008 21.5L0 18.5L0.500008 15.5L1.00001 14.5L1.50001 14L2.00001 13L2.50001 12.5V12L3.00001 11V11.5L3.50001 11L4.00001 10V10.5L4.50001 10L5.00001 9V9.5L5.50001 9L6.00001 8V8.5L6.50001 8L7.00001 7.5L7.50001 7L8.00001 6V6.5L8.50001 6L9.00001 5.5L9.50001 5L10 4V4.5L10.5 4L11 3.5L11.5 2.5V3L12 2.5L12.5 2L13 1.5L13.5 1Z" fill="#FD3C4F"/>
                    <path className="fire-layer fire-layer--mid" d="M7.86663 11.6365C4.86663 13.1365 2.89448 17.1013 1.86663 16.1365C0.838778 15.1716 2.8271 12.3746 5.86663 9.1366C10.3631 5.27367 10.3388 3.67179 11.3666 4.63665C12.3945 5.60151 10.9062 8.3985 7.86663 11.6365Z" fill="#FE7683"/>
                    <path className="fire-layer fire-layer--highlight" d="M10 9C9.00001 10 8.5 10.5 6.5 12C5.00001 10 7.50001 9.5 8 8.5C9.50001 7.5 8 8.5 10 7C11.6569 7 10 7.61929 10 9Z" fill="white"/>
                    <path className="fire-layer fire-layer--core" d="M20 24.5C21 28.5 17.0376 32 14 32C11.5 31 8.00001 31 8.00001 24.5C10 20 12 17.5 14.5 16.5C16 17.5 18.5 21 20 24.5Z" fill="#FFCE29"/>
                    <path className="fire-layer fire-layer--edge" d="M28.0003 20.0006C28.0003 21.0005 27 26.0001 22 30.0001C10.5 34 19 30 19.5 28.5002C19.5 27.0002 19.4998 28 22 25.5002C24.5 24.0001 25.8047 20.5734 28.0003 20.0006Z" fill="#D73343"/>
                    <path className="fire-layer fire-layer--inner" d="M19.4998 28.8618C18.4998 30.362 18.5098 30.382 17.4999 30.8619C13.0002 32.9998 13.5 31.4998 13.5 30.362C16.4999 29.8621 14.6655 30.286 16.5 29.4999C20 28 20.5 25.5 19.4998 28.8618Z" fill="#D9AF23"/>
                </g>
                <path className="icon-shadow" d="M26 34.4999C25.5 37 19.5 36.5 14.2553 36.5C9.00001 36 4.50001 37 2.50001 34.4999C3.50001 32.5 6.50001 32.5 14.2553 32.5C22.239 32.5 24.5 33 26 34.4999Z" fill="#B3B3B3"/>
            </svg>
        </button>
    );
};

export default IconoRacha;