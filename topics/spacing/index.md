---
layout: article
page_id: spacing-primer
breadcrumbs: ["Spacing", "Before variables…"]
sidebar: "Spacing"
title: "Spacing primer"
---

{% capture css %}
    figure#twos-complement {
        display: block;
        width: 3in;
        max-width: 33vw;
        float: right;
        margin-left: 1rem;
        margin-top: 0;
        padding-top: 0;

        > :first-child {
            margin-top: 0;
            padding-top: 0;
        }

        figure {
            display: block;
            margin-bottom: 1rem;
            figcaption {
                font-size: 0.8rem;
                font-weight: bold;
                text-align: center;
                text-transform: uppercase;
                line-height: 1.2;
                margin-top: 0;
            }
        }
        
        .horizontal-stretch, .vertical-stretch {
            font-family: "{{site.data.fonts.names["Amstelvar-Alpha"]}}";
            display: block;
            font-size: 12vw;
            position: relative;

            @media (min-width: 9in) {
                font-size: 1.2in;
            }
            
            samp {
                font-family: inherit;
                display: block;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                line-height: 1;
                
                &.regular {
                    position: relative;
                    color: #CCC;
                }
                
                + samp {
                    color: #999;
                    + samp {
                        color: #333;
                    }
                }
                
            }
        }

        .horizontal-stretch {
            .regular {
                transform: scaleX(1.0);
            }

            .thin {
                transform: scaleX(0.9);
            }
            
            .thinner {
                transform: scaleX(0.8);
            }
        }
        
        .vertical-stretch {
            .regular {
                transform: scaleY(1.2);
            }

            .squat {
                transform: scaleY(1.0);
            }
            
            .squatter {
                transform: scaleY(0.8);
            }
        }
    }
{% endcapture %}

<style>{{css|scssify}}</style>

<figure id='twos-complement'>
    <figure>
        <img src="{{site.baseurl}}/images/articles/spacing-inside-glyphs-1.svg" alt="Default spacing">
        <figcaption>Default spacing</figcaption>
    </figure>

    <figure>
        <img src="{{site.baseurl}}/images/articles/spacing-inside-glyphs-2.svg" alt="Letter boundaries">
        <figcaption>Letter boundaries</figcaption>
    </figure>

    <figure>
        <img src="{{site.baseurl}}/images/articles/spacing-inside-glyphs-3.svg" alt="Kerning">
        <figcaption>Kerning</figcaption>
    </figure>

    <figure>
        <img src="{{site.baseurl}}/images/articles/spacing-inside-glyphs-4.svg" alt="Letterspace plus kerning">
        <figcaption>Letterspace plus kerning</figcaption>
    </figure>

    <figure>
        <img src="{{site.baseurl}}/images/articles/spacing-inside-glyphs-5.svg" alt="Inside-of-letters spacing">
        <figcaption>Inside-of-letters spacing</figcaption>
    </figure>

    <figure class='horizontal-stretch'>
        <samp class='regular'>Two</samp>
        <samp class='thin'>Two</samp>
        <samp class='thinner'>Two</samp>
        <figcaption>Horizontal scale</figcaption>
    </figure>

    <figure class='vertical-stretch'>
        <samp class='regular'>Two</samp>
        <samp class='squat'>Two</samp>
        <samp class='squatter'>Two</samp>
        <figcaption>Vertical scale</figcaption>
    </figure>
</figure>

Digital typography has always included several kinds of spacing mechanisms: some fed by data created by the font developer, some determined by the typographer, and some in the hands of both. 


The images of letters in each style of each family are designed with space around each letter, so the letters, by default, make words well in the direction of reading, and make lines well without interfering with the previous or next line in the other reading direction, from line to line. Digital typography and font formats have long enabled the variation of this surrounding space via tracking, or letterspacing, in percent-of-em changes to the left and right letterspaces, and linespacing in points or percent-of-em changes to the tops and bottoms of spaces between lines.

There is also space inside and around the letters, trapped beyond the reach of tracking or linespacing. In any character with an enclosed space, like <strong>B</strong>,  <strong>g</strong>, or <strong>&amp;</strong>, lakes of white space are formed for the legibility of the letter, while <strong>T;</strong>,  <strong>C</strong>,  <strong>v</strong> and  <strong>g</strong>, again, have bays, fiords and inlets of white space within and around them. In styles of families, these space have only been available to the typographer in the steps offered from one style to another style. 

And any letter that has a part that sticks out in any direction from the midst of a letter, like <strong>L</strong>, <strong>T</strong>, or <strong>4</strong>, and “grabs” white space around the letter somewhere in the direction of reading, can be modified in the font via kerning pairs, i.e., adjustments to particular letter combinations like <strong>LT</strong> or <strong>74</strong>, to bring the white space back to the spacing compatible with the rest, in a smooth flow of letters and words. 

For the most part, high-quality typeface families have thus been a collection of styles in some range of width and weight, with default spacing and pair kerning for each style offering something like snapshots of suggested typeface styles and their spacing that users can weave together with tracking, hyphenation, and justification, over a range of sizes, into a range of solutions.

When some of those solutions fail, typographers can also use horizontal scaling to add to tracking if they need to make text fit (at some expense to the integrity of the type’s design). And for solutions in linespacing Latin text, where the descenders protrude down from the main body of the rest of the letters, typographers either have to accept a single option for descender length for all linespacing solutions, or switch to another font with particular descenders.

Going forward with web type, it’s important to note that historically some things about spacing in desktop applications change when shifting to the web. Desktop apps have made up their own word space, ignoring the one in the fonts; they have supplied automatic pair kerning, manipulated existing kerning when type was tracked, and provided built-in justification with access to hyphenation dictionaries.
