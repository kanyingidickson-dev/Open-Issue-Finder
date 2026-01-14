import { useEffect } from 'react';

interface KeyboardShortcuts {
    [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled = true) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            const key = event.key.toLowerCase();
            const modifierKey = event.metaKey || event.ctrlKey;

            // Build the key combination string
            let combo = '';
            if (modifierKey) combo += 'mod+';
            if (event.shiftKey) combo += 'shift+';
            combo += key;

            if (shortcuts[combo]) {
                event.preventDefault();
                shortcuts[combo]();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
}
