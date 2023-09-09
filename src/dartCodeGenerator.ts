function generateDartCode(useThemeExtensions: boolean, includeFontName: boolean): string {
    try {
        const textStyles = figma.getLocalTextStyles();
        let dartCode = "import 'package:flutter/material.dart';\n\n";

        if (useThemeExtensions) {
            // For AppTextTheme
            dartCode += "@immutable\nclass AppTextTheme extends ThemeExtension<AppTextTheme> {\n";

            // Generate fields
            textStyles.forEach((style) => {
                const formattedStyleName = formatStyleName(style.name);
                dartCode += `  final TextStyle? ${formattedStyleName};\n`;
            });

            // Generate constructor
            dartCode += "\n   const AppTextTheme({\n";
            textStyles.forEach((style) => {
                const formattedStyleName = formatStyleName(style.name);
                dartCode += `    this.${formattedStyleName},\n`;
            });
            dartCode += "  });\n\n";

            // Generate fallback constructor
            dartCode += "  const AppTextTheme.fallback()\n      : this(\n";
            textStyles.forEach((style) => {
                const {
                    fontSize,
                    fontStyle,
                    fontWeight,
                    textDecoration,
                    letterSpacing,
                    fontFamily,
                    lineHeightValue
                } = extractTextStyleProperties(style);
                const formattedStyleName = formatStyleName(style.name);

                dartCode += `        ${formattedStyleName}: const TextStyle(\n`;
                dartCode += `          fontSize: ${fontSize},\n`;
                dartCode += `          fontWeight: FontWeight.w${fontWeight},\n`;

                if (includeFontName) {
                    dartCode += `          fontFamily: "${fontFamily}",\n`;
                }

                if (lineHeightValue !== 'null') {
                    dartCode += `          height: ${lineHeightValue} / ${fontSize},\n`;
                }

                dartCode += `          letterSpacing: ${letterSpacing},\n`;
                dartCode += `          fontStyle: ${fontStyle},\n`;
                dartCode += `          decoration: ${textDecoration},\n`;
                dartCode += `        ),\n`;
            });
            dartCode += "      );\n\n";

            // Generate copyWith method
            dartCode += "  @override\n  AppTextTheme copyWith({\n";
            textStyles.forEach((style) => {
                const formattedStyleName = formatStyleName(style.name);
                dartCode += `    TextStyle? ${formattedStyleName},\n`;
            });
            dartCode += "  }) {\n    return AppTextTheme(\n";
            textStyles.forEach((style) => {
                const formattedStyleName = formatStyleName(style.name);
                dartCode += `      ${formattedStyleName}: ${formattedStyleName} ?? this.${formattedStyleName},\n`;
            });
            dartCode += "    );\n  }\n\n";

            // Generate lerp method
            dartCode += "  @override\n  AppTextTheme lerp(AppTextTheme? other, double t) {\n";
            dartCode += "    if (other is! AppTextTheme) return this;\n";
            dartCode += "    return AppTextTheme(\n";
            textStyles.forEach((style) => {
                const formattedStyleName = formatStyleName(style.name);
                dartCode += `      ${formattedStyleName}: TextStyle.lerp(${formattedStyleName}, other.${formattedStyleName}, t),\n`;
            });
            dartCode += "    );\n  }\n";

        } else {
            // Original TextStyles class
            dartCode += "class TextStyles {\n";
            textStyles.forEach((style) => {
                const formattedStyleName = formatStyleName(style.name);
                const {
                    fontSize,
                    fontStyle,
                    fontWeight,
                    textDecoration,
                    letterSpacing,
                    fontFamily,
                    lineHeightValue
                } = extractTextStyleProperties(style);

                dartCode += generateTextStyleDartCode(
                    formattedStyleName,
                    {
                        fontSize,
                        fontStyle,
                        fontWeight,
                        textDecoration,
                        letterSpacing,
                        fontFamily,
                        lineHeightValue
                    },
                    useThemeExtensions,
                    includeFontName
                );
            });
        }

        dartCode += "}\n";
        return dartCode;
    } catch (error) {
        console.error('An error occurred:', error);
        return '';
    }
}

function generateTextStyleDartCode(
    styleName: string,
    { fontSize, fontStyle, fontWeight, textDecoration, letterSpacing, fontFamily, lineHeightValue }: any,
    useThemeExtensions: boolean,
    includeFontName: boolean
): string {
    let code = `  static const TextStyle ${styleName} = TextStyle(\n`;
    code += `    fontSize: ${fontSize},\n`;
    code += `    fontWeight: FontWeight.w${fontWeight},\n`;

    if (useThemeExtensions) {
        code += `    color: Theme.of(context).primaryColor,\n`;
    }

    if (includeFontName) {
        code += `    fontFamily: "${fontFamily}",\n`;
    }

    if (lineHeightValue !== 'null') {
        code += `    height: ${lineHeightValue} / ${fontSize},\n`;
    }

    code += `    letterSpacing: ${letterSpacing},\n`;
    code += `    fontStyle: ${fontStyle},\n`;
    code += `    decoration: ${textDecoration},\n`;
    code += `  );\n\n`;

    return code;
}
