<p align="center">
  <a href="https://www.figma.com/community-free-resource-license/"><img src="https://img.shields.io/badge/figma-community_license-brightgreen?style=flat-square&logo=figma"></a>
  <a href="https://github.com/mastersam07/figdart/graphs/commit-activity"><img src="https://img.shields.io/badge/Maintained%3F-Yes-success.svg?style=flat-square"></a>
  <a href="https://github.com/mastersam07/figdart/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square"></a>
  <a href="https://twitter.com/intent/tweet?text=Figdart%20is%20awesome.%20I%20use%20it%20to%20generate%20flutter%20styling%20properties%20from%20figma.%20https://github.com/kazuyaseki/figma-to-react/"><img src="https://img.shields.io/badge/Twitter-Tweet-success?style=flat-square&logo=x"></a>
</p>



<p align="center"><img src="./publish/icon.png" align="center" alt="FigDart logo" width="128" height="128"></p>
  
<h1 align="center">Figma Styles to Flutter</h1>

<div align="center">
<a href="https://www.figma.com/community/plugin/1282135889870206898/FigDart" align="center"><img src="publish/install_button.png" align="center" alt="Install Plugin"></a>
</div>

<br />

<img src="publish/demo.gif" align="center" alt="Figdart demo" />


## The Problem

When it comes to translating styles like textstyles and colors, there are a couple of problems that could arise. Some includes:

- Manually converting Figma text styles to Flutter code
- Greater risk of inconsistencies appearing in text styles between the design files and the coded application
- Manually converting styles often results in code duplication
- Manual conversion can lead to errors such as incorrect values, typos, or even omitted styles, which can be costly to debug and fix
- Every time a designer updates a text style in Figma, developers have to manually update the corresponding code, which is both time-consuming and error-prone

## Solution

By automating the conversion process, FigDart aims to eliminate these issues, making the design-to-code workflow more efficient, accurate, and consistent.

### Editor Mode
<img src="publish/editor_mode.gif" align="center" alt="How the plugin works in editor mode" />


### Dev Mode on View Only Access
<img src="publish/dev_mode.gif" align="center" alt="How the plugin works in dev mode" />

## Further features

### Use Theme Extensions

You may choose to register your textstyles as a theme extension.

### Editor Mode
<img src="publish/theme_extension_editor_mode.gif" align="center" alt="theme extension editor mode" />

### Dev Mode on View Only Access
<img src="publish/theme_extension_dev_mode.gif" align="center" alt="theme extension dev mode" />

### Vary textstyle properties

You may select some other textstyle properties like font family

TODO:
- [ ] Text decoration
- [ ] letter spacing
- [ ] line height.

<img src="publish/options.png" align="center" alt="textstyle options" />