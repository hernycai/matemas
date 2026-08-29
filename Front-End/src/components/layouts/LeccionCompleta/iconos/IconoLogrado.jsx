import { useRef } from "react";

const IconoLogrado = () => {
  const btnRef = useRef(null);

  const trofeo = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const host = btn.querySelector(".trophy-trofeo");
    if (!host) return;

   
  };

  return (
    <button
      ref={btnRef}
      className="app-icon app-icon--trophy"
      onClick={trofeo}
      type="button"
    >
      <span className="trophy-trofeo" />
 
      {/* SVG de la copa */}
       <svg class="icon-svg" width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g class="trophy-sparkles" fill="#FFE566">
              <path class="sparkle sparkle--1" d="M4 2 L4.6 3.4 L6 4 L4.6 4.6 L4 6 L3.4 4.6 L2 4 L3.4 3.4 Z"/>
              <path class="sparkle sparkle--2" d="M33 3 L33.5 4.2 L34.7 4.7 L33.5 5.2 L33 6.4 L32.5 5.2 L31.3 4.7 L32.5 4.2 Z"/>
              <path class="sparkle sparkle--3" d="M2 22 L2.4 23 L3.4 23.4 L2.4 23.8 L2 24.8 L1.6 23.8 L0.6 23.4 L1.6 23 Z"/>
              <path class="sparkle sparkle--4" d="M35 20 L35.45 21.1 L36.55 21.55 L35.45 22 L35 23.1 L34.55 22 L33.45 21.55 L34.55 21.1 Z"/>
              <path class="sparkle sparkle--5" d="M18 -1 L18.35 0 L19.35 0.35 L18.35 0.7 L18 1.7 L17.65 0.7 L16.65 0.35 L17.65 0 Z"/>
            </g>
            <path class="icon-shadow" d="M30 32.9999C29.5 35.5 23.5 35 18.2553 35C13 34.5 8.5 35.5 6.5 32.9999C7.5 31 10.5 31 18.2553 31C26.239 31 28.5 31.5 30 32.9999Z" fill="#B3B3B3"/>
            <g class="trophy-body">
              <path d="M8.5 3.5H28.5V6V16L27.5 19L24.5 22.5L23.5 23L22.5 23.5L21 24V26.5H16V24L14.5 23.5L13.5 23L12.5 22.5L9.5 19L8.5 16V6V3.5Z" fill="#FFCE29"/>
              <path d="M11.5 10.4998C11.5 14.0897 11.5 17 10 16.9999C8 17 9 16.9999 8.50001 10.4999C9 3.49987 7.5 3.99953 10.5 3.99985C12 4.00001 11.5 6.91 11.5 10.4998Z" fill="#FFDD69"/>
              <path d="M18 23.5H22L21 24V24.5V27H18V23.5Z" fill="#D9AF23"/>
              <path d="M27.5 18.5001C26.6545 21.337 22.5 24.5 19.5 23.5001C19 24.5 14 24.9999 24 18.5001C26 14.5001 26.5 11.0001 27.5 11.5C28.5 10.5 29 15.5 27.5 18.5001Z" fill="#D9AF23"/>
              <path d="M11.3502 26.5H25.807V27.1154H26.5L27 27.5V28V29L26.4175 29.2968H25.807V29.8778H11.3502V29.2968H10.6553L10 29V27.5L10.6553 27.1154H11.3502V26.5Z" fill="#D98C00"/>
              <path d="M8.40612 0H28.8158V0.728725H29.7941L30.5 1.1842V1.77631V2.96051L29.6777 3.31199H28.8158V4H8.40612V3.31199H7.42511L6.5 2.96051V1.1842L7.42511 0.728725H8.40612V0Z" fill="#FFC04C"/>
              <path d="M21 1L29.7982 1V1.54655H30.2059L30.5 1.88816V2.33223V3.22039L30.1574 3.484H29.7982V4L21.2942 4.016V3.5H19.5V3L20.3591 3.07264V2.33223H21V1.54655V1Z" fill="#FFA704"/>
              <path d="M0.5 9L1 8L2.5 6.5L4.5 5.5L6.5 5L8 5.5L8.5 6V11L8 10.5L7.5 10L6.5 9.5L5.5 10L5 10.5L4.5 11V12L5.5 13L6.5 14L7.5 14.5L8 15L8.5 15.5V16.5L9 17.5L9.5 18.5V19.5L9 20.5L8.5 21H7V20.5L6.5 20L6 19L5.5 18.5L4 17.5L3 16.5L2 15.5L1 14.5L0.5 14L0 11.5L0.5 9Z" fill="#FFA500"/>
              <path d="M36.0263 9L35.5526 8L34.1316 6.5L32.2368 5.5L30.3421 5L28.9211 5.5L28.4474 6V11L28.9211 10.5L29.3947 10L30.3421 9.5L31.2895 10L31.7632 10.5L32.2368 11V12L31.2895 13L30.3421 14L29.3947 14.5L28.9211 15L28.4474 15.5V16.5L27.9737 17.5L27.5 18.5V19.5L27.9737 20.5L28.4474 21H29.8684V20.5L30.3421 20L30.8158 19L31.2895 18.5L32.7105 17.5L33.6579 16.5L34.6053 15.5L35.5526 14.5L36.0263 14L36.5 11.5L36.0263 9Z" fill="#FFA500"/>
              <path d="M15.5 3C16 4 14 4 12.5 4C10.8431 4 9 4 9.5 3C9.5 2.44772 10 1.5 12.5 1.5C16 1.5 15.5 2.44772 15.5 3Z" fill="#FFFDF8"/>
              <path d="M23.5 14C23.5 16.7614 21.2614 19.5 18.5 19.5C15.7386 19.5 13.5 16.7614 13.5 14C13.5 11.2386 15.7386 9 18.5 9C21.2614 9 23.5 11.2386 23.5 14Z" fill="#FFA500"/>
              <rect x="16.5" y="16" width="4" height="1" fill="#FFCE29"/>
              <path d="M18 11H19V16H18V13.5V12.5H16.5L17 12L17.5 11.5L18 11Z" fill="#FFCE29"/>
            </g>
          </svg>
    </button>
  );
};

export default IconoLogrado;