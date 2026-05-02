export type StarData = {
    id: number;
    top: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    type: 'background' | 'medium' | 'bright';
};

export const generateStars = (count: number): StarData[] => {
    return Array.from({ length: count }).map((_, i) => {
        const rand = Math.random();
        let type: 'background' | 'medium' | 'bright' = 'background';
        let size = Math.random() * 1.5 + 0.5;

        if (rand > 0.90) {
            type = 'bright';
            size = Math.random() * 2 + 3;
        } else if (rand > 0.65) {
            type = 'medium';
            size = Math.random() * 2 + 1;
        }

        return {
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: size,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
            type: type,
        };
    });
};

export const MONTHS = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

export const YEARS = Array.from({ length: 10 }, (_, i) => String(2026 + i));

export const PERIOD_OPTIONS = [
    "Inizio Mese",
    "Metà Mese",
    "Fine Mese",
    "Indifferente / Tutto il mese"
];