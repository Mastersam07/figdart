if (figma.editorType === 'figma' || figma.editorType === 'dev') {
    figma.showUI(__html__, { width: 600, height: 600 });

    figma.ui.onmessage = async msg => {
        if (msg.type === 'generate-textstyles') {
            const useThemeExtensions = msg.useThemeExtensions;
            const includeFontName = msg.includeFontName;
            let dartCode = await generateTextStyles(useThemeExtensions, includeFontName);
            figma.ui.postMessage({ type: 'dart-code', code: dartCode });
        }

        if (msg.type === 'generate-colors') {
            let dartCode = await generateColors();
            figma.ui.postMessage({ type: 'dart-code', code: dartCode });
        }

        if (msg.type === 'generate-effects') {
            let dartCode = await generateEffectStyles();
            figma.ui.postMessage({ type: 'dart-code', code: dartCode });
        }
    };
}
