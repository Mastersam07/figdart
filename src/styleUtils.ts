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
    // Split the name by slash and map each part to CamelCase
    const camelCase = name
        .split('/')
        .map(part => 
            part
            .split(/[\s-]/)
            .map(subPart => subPart.charAt(0).toUpperCase() + subPart.slice(1))
            .join('')
        )
        .join('');
    
    // Make the first letter lowercase and return
    return camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
}