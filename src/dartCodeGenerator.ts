function generateTextStyles(useThemeExtensions: boolean, includeFontName: boolean): string {
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
                    const height = Math.round((lineHeightValue / fontSize) * 100) / 100;
                    dartCode += `          height: ${height},\n`;
                }

                if (letterSpacing != null && letterSpacing !== 'null' && letterSpacing !== 0) {
                    const roundedLetterSpacing = Math.round((letterSpacing * fontSize / 100) * 100) / 100;
                    dartCode += `          letterSpacing: ${roundedLetterSpacing},\n`;
                }
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
            dartCode += "abstract class AppTextStyles {\n";
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
                    includeFontName,
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


function generateColors(): string {
    try {
        const localColorStyles = figma.getLocalPaintStyles();
        let dartCode = "import 'package:flutter/material.dart';\n\n";
        dartCode += 'abstract class AppColors {\n';

        for (const style of localColorStyles) {
            const paint = style.paints[0]; // assuming the first paint is what you want
            if (paint.type === 'SOLID') {
                const r = paint.color.r;
                const g = paint.color.g;
                const b = paint.color.b;
                const opacity = paint.opacity || 1;

                dartCode += generateColorStyleDartCode(formatColorName(style.name), r, g, b, opacity);
            } else if (paint.type === 'GRADIENT_LINEAR') {
                // Assuming stops is an array of color stop objects containing color and position
                const stops = paint.gradientStops.map(stop => {
                    const { r, g, b } = stop.color;
                    const a = 1;
                    return `Color(0x${toHex(a)}${toHex(r)}${toHex(g)}${toHex(b)})`;
                }).join(', ');

                dartCode += `  static const ${formatColorName(style.name)} = LinearGradient(colors: [${stops}]);\n\n`;
            }
        }

        dartCode += '}\n';
        return dartCode;
    } catch (error) {
        console.error('An error occurred:', error);
        return '';
    }
}

function generateTextStyleDartCode(
    styleName: string,
    { fontSize, fontStyle, fontWeight, textDecoration, letterSpacing, fontFamily, lineHeightValue }: any,
    includeFontName: boolean
): string {
    let code = `  static const TextStyle ${styleName} = TextStyle(\n`;
    code += `    fontSize: ${fontSize},\n`;
    code += `    fontWeight: FontWeight.w${fontWeight},\n`;

    if (includeFontName) {
        code += `    fontFamily: "${fontFamily}",\n`;
    }

    if (lineHeightValue !== 'null') {
        const height = Math.round((lineHeightValue / fontSize) * 100) / 100;
        code += `    height: ${height},\n`;
    }

    if (letterSpacing != null && letterSpacing !== 'null' && letterSpacing !== 0) {
        const roundedLetterSpacing = Math.round((letterSpacing * fontSize / 100) * 100) / 100;
        code += `    letterSpacing: ${roundedLetterSpacing},\n`;
    }
    code += `    fontStyle: ${fontStyle},\n`;
    code += `    decoration: ${textDecoration},\n`;
    code += `  );\n\n`;

    return code;
}

function generateColorStyleDartCode(styleName: string, r: number, g: number, b: number, opacity: number = 1): string {
    // Convert color channels and opacity to hex format
    const a = padStart(Math.floor(opacity * 255).toString(16), 2, '0');
    const rHex = padStart(Math.floor(r * 255).toString(16), 2, '0');
    const gHex = padStart(Math.floor(g * 255).toString(16), 2, '0');
    const bHex = padStart(Math.floor(b * 255).toString(16), 2, '0');

    // Generate Dart code
    let code = `  static const Color ${styleName} = Color(0x${a}${rHex}${gHex}${bHex});\n\n`;

    return code;
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