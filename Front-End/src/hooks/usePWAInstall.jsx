/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Detectar si ya está instalada
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        setIsInstalled(isStandalone);

        // Si ya está instalada, no mostrar botón
        if (isStandalone) {
            return;
        }

        // Función para verificar si el service worker está registrado
        const checkServiceWorker = async () => {
            try {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    return registrations.length > 0;
                }
                return false;
            } catch (error) {
                console.error('Error checking service worker:', error);
                return false;
            }
        };

        // Escuchar el evento beforeinstallprompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Escuchar cuando se completa la instalación
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        // Configurar listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // El registro del SW lo hace vite-plugin-pwa (registerSW). Acá solo detectamos install.
        const initSW = async () => {
            const hasSW = await checkServiceWorker();
            if (hasSW) {
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    setTimeout(() => {
                        if (!deferredPrompt && !isInstalled) {
                            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
                            const isEdge = /Edg/.test(navigator.userAgent);
                            if (isChrome || isEdge) {
                                setIsInstallable(true);
                            }
                        }
                    }, 3000);
                }
            }
        };

        initSW();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) {
            const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
            if (isIOS) {
                return 'manual-ios';
            }

            // Verificar si el navegador soporta instalación
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            const isEdge = /Edg/.test(navigator.userAgent);

            if (isChrome || isEdge) {
                return 'manual-browser';
            }

            return 'unavailable';
        }

        try {
            await deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;

            if (result.outcome === 'accepted') {
                console.log('PWA instalada exitosamente');
                setIsInstalled(true);
                setIsInstallable(false);
                return 'accepted';
            } else {
                console.log('Usuario rechazó la instalación');
                return 'dismissed';
            }
        } catch (error) {
            console.error('Error al instalar PWA:', error);
            return 'error';
        } finally {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return { isInstallable, isInstalled, installApp };
};

export default usePWAInstall;