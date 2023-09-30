function generateTextStyles(useThemeExtensions: boolean, includeFontName: boolean): string {
    try {
        const textStyles = figma.getLocalTextStyles();
        if (textStyles.length === 0) {
            return "No defined textstyles";
        }
        let dartCode = "import 'package:flutter/material.dart';\n\n";

        if (useThemeExtensions) {
            // For AppTextTheme
            dartCode += "@immutable\nclass AppTextTheme extends ThemeExtension<AppTextTheme> {\n";

            // Generate fields
            textStyles.forEach((style, index) => {
                const formattedStyleName = formatStyleName(style.name, index);
                dartCode += `  final TextStyle? ${formattedStyleName};\n`;
            });

            // Generate constructor
            dartCode += "\n   const AppTextTheme({\n";
            textStyles.forEach((style, index) => {
                const formattedStyleName = formatStyleName(style.name, index);
                dartCode += `    this.${formattedStyleName},\n`;
            });
            dartCode += "  });\n\n";

            // Generate fallback constructor
            dartCode += "  const AppTextTheme.fallback()\n      : this(\n";
            textStyles.forEach((style, index) => {
                const {
                    fontSize,
                    fontStyle,
                    fontWeight,
                    textDecoration,
                    letterSpacing,
                    fontFamily,
                    lineHeightValue
                } = extractTextStyleProperties(style);
                const formattedStyleName = formatStyleName(style.name, index);

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
            textStyles.forEach((style, index) => {
                const formattedStyleName = formatStyleName(style.name, index);
                dartCode += `    TextStyle? ${formattedStyleName},\n`;
            });
            dartCode += "  }) {\n    return AppTextTheme(\n";
            textStyles.forEach((style, index) => {
                const formattedStyleName = formatStyleName(style.name, index);
                dartCode += `      ${formattedStyleName}: ${formattedStyleName} ?? this.${formattedStyleName},\n`;
            });
            dartCode += "    );\n  }\n\n";

            // Generate lerp method
            dartCode += "  @override\n  AppTextTheme lerp(AppTextTheme? other, double t) {\n";
            dartCode += "    if (other is! AppTextTheme) return this;\n";
            dartCode += "    return AppTextTheme(\n";
            textStyles.forEach((style, index) => {
                const formattedStyleName = formatStyleName(style.name, index);
                dartCode += `      ${formattedStyleName}: TextStyle.lerp(${formattedStyleName}, other.${formattedStyleName}, t),\n`;
            });
            dartCode += "    );\n  }\n";

        } else {
            // Original TextStyles class
            dartCode += "abstract class AppTextStyles {\n";
            textStyles.forEach((style, index) => {
                const formattedStyleName = formatStyleName(style.name, index);
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

        if (localColorStyles.length === 0) {
            return "No defined colors";
        }

        let dartCode = "import 'package:flutter/material.dart';\n\n";
        dartCode += 'abstract class AppColors {\n';

        localColorStyles.forEach((style, index) => { // Changed to forEach to get index
            const paint = style.paints[0]; // assuming the first paint is what you want
            if (paint.type === 'SOLID') {
                const r = paint.color.r;
                const g = paint.color.g;
                const b = paint.color.b;
                const opacity = paint.opacity || 1;

                dartCode += generateColorStyleDartCode(formatColorName(style.name, index), r, g, b, opacity); // Passed index
            } else if (paint.type === 'GRADIENT_LINEAR') {
                // Assuming stops is an array of color stop objects containing color and position
                const stops = paint.gradientStops.map(stop => {
                    const { r, g, b } = stop.color;
                    const a = 1;
                    return `Color(0x${toHex(a)}${toHex(r)}${toHex(g)}${toHex(b)})`;
                }).join(', ');

                dartCode += `  static const ${formatColorName(style.name, index)} = LinearGradient(colors: [${stops}]);\n\n`; // Passed index
            }
        });

        dartCode += '}\n';
        return dartCode;
    } catch (error) {
        console.error('An error occurred:', error);
        return '';
    }
}

function generateEffectStyles(): string {
    try {
        const localEffectStyles = figma.getLocalEffectStyles();

        if (localEffectStyles.length === 0) {
            return "No defined effect styles";
        }

        let dartCode = "import 'package:flutter/material.dart';\n\n";
        dartCode += 'abstract class AppEffectStyles {\n';

        localEffectStyles.forEach((style, index) => {
            const formattedStyleName = formatEffectStyleName(style.name, index);
            const effects = style.effects; // Array of effects

            effects.forEach((effect, effectIndex) => {
                const effectName = `${formattedStyleName}Effect${effectIndex}`;
                if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
                    const { color, offset, radius, spread } = effect;
                    const { r, g, b, a } = color;
                    const colorCode = `Color(0x${toHex(a)}${toHex(r)}${toHex(g)}${toHex(b)})`;
                    const offsetCode = `Offset(${offset.x}, ${offset.y})`;
                    dartCode += `  static const BoxShadow ${effectName} = BoxShadow(\n`;
                    dartCode += `    color: ${colorCode},\n`;
                    dartCode += `    offset: ${offsetCode},\n`;
                    dartCode += `    blurRadius: ${radius},\n`;
                    dartCode += `    spreadRadius: ${spread},\n`;
                    dartCode += `  );\n\n`;
                } else if (effect.type === "LAYER_BLUR" || effect.type === "BACKGROUND_BLUR") {
                    const { radius } = effect;
                    dartCode += `  static const double ${effectName}BlurRadius = ${radius};\n\n`;
                }
            });
        });

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


