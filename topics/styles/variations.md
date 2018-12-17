---
layout: article
breadcrumbs: ["Styles"]
sidebar: "Styles, meet instances"
title: "Styles, meet instances"
---
A variable font file contains a minimum of one axis, which typically provides a fluid variation of styles that are visually congruent versions of a single design. Such a file can just contain width (<b>wdth</b>) and weight (<b>wght</b>) axes like many font families today, while making that range the basis for a “design space” of a font family with “instances,” rather than discrete styles. 

In the replication of many existing font families, one variable-font file will contain the regular design and the original styles as named instances, allowing them to show in menus that match preexisting styles while coming from a variable font’s design space. Another variable-font file would contain the italic version with matching styles, if needed. It is also possible for a single variable font to contain regular and slant (<b>slnt</b>) axes, providing the family with an “italic” that is superior to computer-generated obliqued font styles. And, with an italic (<b>ital</b>) axis, a variable font can substitute contours from regular designs for an italic design. 

The font specification also contains an axis that is new to desktop and web software: optical size (<strong>opsz</strong>). And variable fonts can contain numerous  custom (or unregistered) axes, and thus styles in a design space that is new or unfamiliar to users.
