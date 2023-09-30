if (figma.editorType === 'figma' || figma.editorType === 'dev') {
    figma.showUI(__html__, { width: 600, height: 600 });

    figma.ui.onmessage = msg => {
        if (msg.type === 'generate-textstyles') {
            const useThemeExtensions = msg.useThemeExtensions;
            const includeFontName = msg.includeFontName;
            let dartCode = generateTextStyles(useThemeExtensions, includeFontName);
            figma.ui.postMessage({ type: 'dart-code', code: dartCode });
        }

        if (msg.type === 'generate-colors') {
            let dartCode = generateColors();
            figma.ui.postMessage({ type: 'dart-code', code: dartCode });
        }

        if (msg.type === 'generate-effects') {
            let dartCode = generateEffectStyles();
            figma.ui.postMessage({ type: 'dart-code', code: dartCode });
        }
    };
}
