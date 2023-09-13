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

function formatColorName(name: string): string {
    return name.split('/')
      .join(' ') // Replace slashes with spaces
      .replace(/[^\w\s]/g, '') // Remove all non-alphanumeric characters
      .split(' ') // Split by space to get individual words
      .map((word, index) => index === 0 ? word.toLowerCase() : capitalizeFirstLetter(word.toLowerCase())) // Capitalize each word, but keep the first one in lowercase
      .join('');
  }
  
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }