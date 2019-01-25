---
layout: article
breadcrumbs: ["Overview / Before variables…"]
sidebar: "An old and stable font format"
title: "An old and stable font format"
subtitle: "More than thirty years later, SFNT still serves the needs of users and software developers"
---
Before the introduction of variations in <a href="https://docs.microsoft.com/en-us/typography/opentype/spec/#opentype-specification-version-180">OpenType 1.8</a>, the OpenType standard font format had evolved from Mac-specific TrueType to include Microsoft-specific TrueType, which merged with Adobe PostScript to form OpenType 1.0. OpenType can contain either TrueType or compressed PostScript (CFF), and it has since evolved into several webfont formats, and ultimately into the WOFF standard. 

{% include inline-example.html example="font-format-timeline" %}

This evolution has been possible because OpenType is based on the extendable Spline Font format (<a href="https://en.wikipedia.org/wiki/SFNT">SFNT</a>), originally developed by Apple and renamed TrueType in the late 1980s. This format allows tables to be added that don’t disturb preexisting applications and users, as well as allowing new things for new tables, and letting each operating system and application define which tables are required and which are optional.

So, from the original Mac TrueType to OpenType 1.8, the format has evolved with backward compatibility, adding tables to get to a different backward compatibility for Microsoft Windows, and another one for Adobe, resulting ultimately in a large set of tables involved for compatibility with all three of OpenType/TrueType’s owners. This section does not try to document the entire OpenType format before 1.8; that can be found elsewhere: see <a href="https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6.html">Apple</a>, <a href="https://www.adobe.com/products/type/opentype.html">Adobe</a>, and <a href="https://docs.microsoft.com/en-us/typography/opentype/">Microsoft</a>.

Each example of each topic documents the way particular features in OpenType fonts work, and how each example would have been unachievable or impractical before variable fonts—in many cases, in variable fonts without parametric axes. This, we hope, will serve not only to highlight forward capabilities that are possible with our suggestions, but also to assure web typographers that there is a way for typographic code on the web to fall back, since many conditions—slow connections, older systems, and so on—will force the presentation to do so.
