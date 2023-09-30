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

function formatEffectStyleName(name: string, index: number): string {
    if (!name) return `effectStyle${index}`;
    return name
        .split('/')
        .map(part => 
            part
            .replace(/[^a-zA-Z0-9]/g, ' ')
            .split(' ')
            .map(subPart => subPart.charAt(0).toUpperCase() + subPart.slice(1))
            .join('')
        )
        .join('')
        .replace(/^./, str => str.toLowerCase());
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
    if (!name) return `textStyle${index+1}`;
    // Split the name by slash and map each part to CamelCase
    const camelCase = name
      .split('/')
      .map(part =>
        part
          .trim() // remove leading and trailing spaces in each part
          .replace(/[^a-zA-Z0-9\s]/g, '') // remove all non-alphanumeric characters except space
          .split(/\s+/) // split by one or more spaces
          .map(subPart => subPart.charAt(0).toUpperCase() + subPart.slice(1))
          .join('')
      )
      .join('');
  
    // Make the first letter lowercase and return
    return camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
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