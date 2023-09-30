// Infers Dart fontWeight from Figma fontStyle
function inferFontWeightFromStyle(fontStyle: string): number {
    if (fontStyle.includes('Bold')) return 700;
    if (fontStyle.includes('Medium')) return 500;
    return 400; // Default weight
}

// Infers Dart fontStyle from Figma fontStyle
function inferFontStyleFromStyle(fontStyle: string): string {
    if (fontStyle.includes('Italic')) return 'FontStyle.italic';
    if (fontStyle.includes('Oblique')) return 'FontStyle.italic'; // Dart doesn't support 'oblique'
    return 'FontStyle.normal'; // Default style
}

// Maps Figma text decorations to Dart's TextDecoration enum
function mapTextDecorationToDart(decoration: string): string {
    const map: Record<string, string> = {
        'none': 'TextDecoration.none',
        'underline': 'TextDecoration.underline',
        'overline': 'TextDecoration.overline',
        'line-through': 'TextDecoration.lineThrough',
    };
    return map.hasOwnProperty(decoration.toLowerCase()) ? map[decoration.toLowerCase()] : 'TextDecoration.none';
}

function formatColorName(name: string, index: number): string {
    if (!name) return `color${index}`; // or any default name you prefer
    const words = name
        .replace(/[^a-zA-Z0-9 ]/g, ' ') // Remove all non-alphanumeric characters and replace with space
        .trim() // Remove leading and trailing spaces
        .split(/\s+/); // Split by one or more spaces
    return words.map((word, index) => index === 0 ? word.toLowerCase() : capitalizeFirstLetter(word.toLowerCase())).join('');
}

function formatEffectStyleName(name: string, index: number): string {
    if (!name) return `effectStyle${index}`;
    const words = name
        .replace(/[^a-zA-Z0-9 ]/g, ' ') // Remove all non-alphanumeric characters and replace with space
        .trim() // Remove leading and trailing spaces
        .split(/\s+/); // Split by one or more spaces
    return words.map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function extractTextStyleProperties(style: any) {
    return {
        fontSize: style.fontSize,
        fontStyle: inferFontStyleFromStyle(style.fontName.style),
        fontWeight: inferFontWeightFromStyle(style.fontName.style),
        decoration: style.textDecoration,
        letterSpacing: style.letterSpacing?.value || 0,
        fontFamily: style.fontName.family,
        lineHeightValue: style.lineHeight?.unit !== 'AUTO' ? style.lineHeight.value : 'null',
        textDecoration: mapTextDecorationToDart(style.textDecoration)
    };
}

// Format style name
function formatStyleName(name: string, index: number): string {
    if (!name) return `textStyle${index}`;
    const words = name
        .replace(/[^a-zA-Z0-9 ]/g, ' ') // Remove all non-alphanumeric characters and replace with space
        .trim() // Remove leading and trailing spaces
        .split(/\s+/); // Split by one or more spaces
    return words.map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function toHex(channel: number): string {
    return padStart(Math.floor(channel * 255).toString(16), 2, '0');
}

function padStart(str: string, maxLength: number, fillString: string = ' '): string {
    if (str.length >= maxLength) {
        return str;
    }
    return Array(maxLength - str.length + 1).join(fillString) + str;
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}