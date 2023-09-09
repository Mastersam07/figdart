


if (figma.editorType === 'figma' || figma.editorType === 'figjam') {
    figma.showUI(__html__, { width: 600, height: 600 });

    figma.ui.onmessage = msg => {
        if (msg.type === 'generate-textstyles') {
            const useThemeExtensions = msg.useThemeExtensions;
            const includeFontName = msg.includeFontName;
            let dartCode = generateDartCode(useThemeExtensions, includeFontName);
            figma.ui.postMessage({ type: 'dart-code', code: dartCode });
        }
    };
}
