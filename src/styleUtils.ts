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
function formatStyleName(name: string): string {
    // Remove the part before and including the slash
    const partsAfterSlash = name.split('/')[1] || name;
  
    // Remove spaces and dashes, and make the first letter of each word uppercase
    const camelCase = partsAfterSlash
      .split(/[\s-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  
    // Make the first letter lowercase
    return camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
  }