---
---
(function() {
"use strict";

window.globalAxes = {{site.data.fonts.axes[site.data.fonts.names["Amstelvar-Alpha"]]|jsonify}};
window.axisDefaults = Object.keys(globalAxes).reduce(function(defaults, axis, i) { if ("default" in globalAxes[axis]) { defaults[axis] = globalAxes[axis].default; } return defaults; }, {});


function varbroSetup() {
    overrideTNJS();
    addNav();
    setupSidebar();
    setupExamples();
    setupPlaygrounds();
    window.addEventListener('load', setupFitToWidth);
    window.addEventListener('resize', setupFitToWidth);
    //and once more just to make sure the fonts are loaded
    setTimeout(setupFitToWidth, 1000);
}

doOnReady(varbroSetup);

//handy polyfills and utility functions

// forEach on nodes, from MDN
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// and why not forEach on objects
if (!Object.prototype.forEach) {
    Object.prototype.forEach = function(callback) {
        var thiss = this;
        Object.keys(thiss).forEach(function(k) {
            callback(thiss[k], k);
        });
    }
}

// jQuery-style addClass/removeClass are not canon, but more flexible than ClassList
if (!HTMLElement.prototype.hasClass) {
    HTMLElement.prototype.hasClass = function(str) {
        var el = this;
        var words = str.split(/\s+/);
        var found = true;
        words.forEach(function(word) {
            found = found && el.className.match(new RegExp("(^|\\s)" + word + "($|\\s)"));
        });
        return !!found;
    }
}

var spacere = /\s{2,}/g;
if (!HTMLElement.prototype.addClass) {
    HTMLElement.prototype.addClass = function(cls) {
        this.className += ' ' + cls;
        this.className = this.className.trim().replace(spacere, ' ');
        return this;
    }
}

if (!HTMLElement.prototype.removeClass) {
    HTMLElement.prototype.removeClass = function(cls) {
        var i, words = cls.split(/\s+/);
        if (words.length > 1) {
            for (var i=0; i < words.length; i++) {
                this.removeClass(words[i]);
            }
        } else {
            var classre = new RegExp('(^|\\s)' + cls + '($|\\s)', 'g');
            while (classre.test(this.className)) {
                this.className = this.className.replace(classre, ' ').trim().replace(spacere, '');
            }
        }
        return this;
    }
}

//synthetic events
if (!HTMLElement.prototype.trigger) {
    HTMLElement.prototype.trigger = function(type) {
        var evt;
        if (typeof window.Event === "function"){ 
            evt = new Event(type);
        } else { 
            evt = document.createEvent('Event');
            evt.initEvent(type, true, true);
        }
        return this.dispatchEvent(evt);
    }
}

// closest, from MDN
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1); 
        return null;
    };  
}

// not in the spec, but seems weird to be able to do it on elements but not text nodes
if (!Node.prototype.closest) {
    Node.prototype.closest = function(s) {
        return this.parentNode && this.parentNode.closest(s);
    }
}

// my own invention
if (!RegExp.escape) {
    RegExp.escape= function(s) {
        return s.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, '\\$&');
    };
}



//like jQuery function
function doOnReady(func, thisArg) {
    if (thisArg) {
        func = func.bind(thisArg);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', func);
    } else {
        func();
    }
}

// shortcuts to get dimensions of element minus padding, equivalent to jQuery width() and height()
if (!Element.prototype.contentWidth) {
    Element.prototype.contentWidth = function() {
        var fullwidth = this.getBoundingClientRect().width;
        var css = getComputedStyle(this);
        return fullwidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
    }
}

if (!Element.prototype.contentHeight) {
    Element.prototype.contentHeight = function() {
        var fullheight = this.getBoundingClientRect().height;
        var css = getComputedStyle(this);
        return fullheight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    }
}


if (!HTMLFormElement.prototype.serialize) {
    HTMLFormElement.prototype.serialize = function() {
        var form = this;
        var req = [];
        form.querySelectorAll('input:enabled').forEach(function(input) {
            if ((input.type === 'checkbox' || input.type === 'radio') && !input.checked) {
                return;
            }
            req.push(encodeURIComponent(input.name) + '=' + encodeURIComponent(input.value));
        });

        form.querySelectorAll('select:enabled').forEach(function(select) {
            var options = select.querySelectorAll('option:checked');
            if (options) {
                options.forEach(function(opt) {
                    req.push(encodeURIComponent(select.name) + '=' + encodeURIComponent(opt.value));
                });
            }
        });
        return req.join("&");
    };
}


function doAjax(url, options) {
    var xhr = new XMLHttpRequest();
    if (options.complete) {
        xhr.addEventListener("load", function() { options.complete(xhr); });
    }
    xhr.open(options.method || 'GET', url);
    
    if (options.data) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Content-type'] = 'application/x-www-form-urlencoded';
    }
    
    if (options.headers) {
        console.log(options);
        options.headers.forEach(function (v, k) {
            xhr.setRequestHeader(k, v);
        });
    }
    xhr.send(options.data);
};

// END POLYFILLS

window.obj2fvs = function(fvs) {
    var clauses = [];
    fvs.forEach(function(v, k) {
        clauses.push('"' + k + '" ' + v);
    });
    return clauses.join(", ");
};

window.fvs2obj = function(css) {
    var result = {};
    css.split(',').forEach(function(clause) {
        var m = clause.match(/['"](....)['"]\s+(\-?[0-9\.]+)/);
        if (m) {
            result[m[1]] = parseFloat(m[2]);
        }
    });
    return result;
};

function setupSidebar() {
    // style current link
/*
    document.querySelectorAll('.content-filters li a').forEach(function(a) {
        console.log(a.href, window.location.href);
        if (a.href === window.location.href) {
            a.className += ' current';
        }
    });
*/
}

function setupFitToWidth() {
    var spans = document.querySelectorAll('.specimen.fit-to-width span.rendered');
    var specimens = [];

    //write pass
    spans.forEach(function(span) {
        var specimen = span.closest('.specimen.fit-to-width');
        specimens.push(specimen);
        specimen.style.overflow = 'hidden';
        span.style.whiteSpace = 'nowrap';
        //make bigger for more accurate math
        span.style.fontSize = "72px";
    });

    var doIt = function() {
        //read pass
        var ratios = [];
        var fvs = [];
        var oldsize = [];
        spans.forEach(function(span, i) {
            var specimen = specimens[i];
            var specimenStyle = getComputedStyle(specimen);
            var spanStyle = getComputedStyle(span);
            var currentWidth = span.getBoundingClientRect().width;
            var fullWidth = specimen.getBoundingClientRect().width - parseFloat(specimenStyle.paddingLeft) - parseFloat(specimenStyle.paddingRight);
            var fitratio = parseFloat(specimen.getAttribute('data-fit-ratio')) || 1.0;
            ratios.push(fullWidth / currentWidth * fitratio);
            fvs.push(spanStyle.fontVariationSettings);
            oldsize.push(parseFloat(spanStyle.fontSize));
        });
        
        //write pass
        spans.forEach(function(span, i) {
            console.log(oldsize[i], ratios[i]);
            var newsize = Math.floor(oldsize[i] * ratios[i]);
            span.style.fontSize = newsize + "px";
            if (fvs[i].indexOf('opsz') >= 0) {
                span.style.fontVariationSettings = fvs[i].replace(/(.)opsz(.)\s+[\d\.\-]+/g, '$1opsz$2 ' + newsize);
            } else {
                var opszrule = '"opsz" ' + newsize;
                span.style.fontVariationSettings = fvs[i] ? fvs[i] + ', ' + opszrule : opszrule; 
            }
        });
    };
    
    //recalculate a few times because opsz changes width
    doIt();
    doIt();
    doIt();
}

function overrideTNJS() {
    //cancel expando/collapse sidebar headers
    document.querySelectorAll('.content-filters h3 a').forEach(function(a) {
        a.addEventListener('click', function(evt) {
            if (this.href) {
                window.location.href = this.href;
                return;
            }
        });
    });
}

function addNav() {
    //add prev/next links to article pages by walking the sidebar
    var prev, next;
    var links = document.querySelectorAll('aside.content-filters li a');
    links.forEach(function(a, i) {
        if (a.href === window.location.href) {
            if (i > 0) {
                prev = links[i-1];
            }
            if (i < links.length-1) {
                next = links[i+1];
            }
        }
    });

    var nav = document.getElementById('varbro-article-nav');
    var ul = document.createElement('ul');
    var li;
    if (prev) {
        li = document.createElement('li');
        li.innerHTML = "<label>Previous</label> ";
        li.appendChild(prev.cloneNode(true));
        ul.appendChild(li);
    }
    if (next) {
        li = document.createElement('li');
        li.innerHTML = "<label>Next</label> ";
        li.appendChild(next.cloneNode(true));
        ul.appendChild(li);
    }
    nav.appendChild(ul);
}

function doOverlay(content) {
    var overlay = document.getElementById('playground-overlay');
    if (overlay) {
        overlay.parentElement.removeChild(overlay);
    }
    overlay = document.createElement('div');
    overlay.id = 'playground-overlay';

    var closeButton = document.createElement('button');
    closeButton.textContent = "×";
    closeButton.className = 'close';
    closeButton.setAttribute('type', 'button');

    if (typeof content === 'string') {
        overlay.innerHTML = content;
    } else {
        overlay.appendChild(content);
    }
    
    closeButton.addEventListener('click', function(evt) {
        overlay.parentElement.removeChild(overlay);
    });
    
    overlay.appendChild(closeButton);

    document.body.appendChild(overlay);
}

function setupExamples() {
/*
<div class='playground'>
    <div class='output frame'>
        <div class='wrapper'></div>
    </div>
    <div class='html frame'>
        <div class='editor' contenteditable></div>
    </div>
    <div class='css frame'>
        <div class='editor' contenteditable></div>
    </div>
</div>
*/
    document.querySelectorAll('a.open-playground').forEach(function(button) {
        var specimen = document.querySelector(button.getAttribute('href')) || button.closest('.specimen');
        button.addEventListener('click', function(evt) {
            evt.preventDefault();
            if (!specimen) {
                console.log(button);
                alert("No specimen found!");
                return;
            }
            window.doAjax("/playground-template.html", {
                'complete': function(xhr) {
                    var temp = document.createElement('div');
                    temp.innerHTML = xhr.responseText;
                    var playground = temp.querySelector('.playground');
                    var outputFrame = playground.querySelector('.output.frame .wrapper');
                    var htmlFrame = playground.querySelector('.html.frame .editor');
                    var cssFrame = playground.querySelector('.css.frame .editor');

                    var styles = [];
                    var codes = [];
                    
                    if (specimen.hasClass('editorial')) {
                        outputFrame.style.maxWidth = specimen.getBoundingClientRect().width + 'px';
                    }
                    
                    var ignoreClasses = /\b(specimen|single-line|editorial|paragraph|has-label|fit-to-width)\b/g;
                    specimen.querySelectorAll('span.rendered').forEach(function(span) {
                        var style = {};
                        var subspec = span.closest('.specimen');
                        style.tag = subspec.tagName.toLowerCase();
                        style.className = subspec.className.replace(ignoreClasses, '').replace(/\s+/g, ' ').trim();
                        style.css = span.getAttribute('style').trim().split(/\s*;\s*/);
                        styles.push(style);
 
                        codes.push('<' + style.tag + ' class="' + style.className + '">\n  ' + span.innerHTML.trim() + '\n</' + style.tag + '>');
                    });
 
                    styles.forEach(function(style, i) {
                        var classes = '.' + style.className.trim().replace(/\s+/g, '.');
                        classes = classes.replace(ignoreClasses, '');
                        if (classes === '.') {
                            classes = '';
                        }
                        styles[i] = style.tag + classes + ' {\n  ' + style.css.join(";\n  ").replace(/:(\S)/g, ": $1").trim() + '\n}';
                    });
                    
                    cssFrame.textContent = styles.join("\n\n");

                    htmlFrame.textContent = codes.join("\n\n").replace(/\. \{/g, ' {').replace(/ class=""/g, '');

                    doOverlay(playground);
                    
                    setTimeout(setupPlaygrounds);
                }
            })
        });
    });
}

function setupPlaygrounds() { 
    document.querySelectorAll('.playground').forEach(function(playground, i) {
        if (playground.getAttribute('data-processed') === 'true') {
            return;
        }

        var output = playground.querySelector('.output.frame .wrapper');
        var html = playground.querySelector('.html.frame');
        var css = playground.querySelector('.css.frame');

        var styleid = 'playground-' + i + '-style';
        var style = document.getElementById(styleid);
        if (!style) {
            style = document.createElement('style');
            style.id = styleid;
            document.head.appendChild(style);
        }

        var updatetimeout;
        var oldHTML, oldCSS;
        function update() {
            var newHTML = html.textContent;
            var newCSS = css.textContent.replace(/^.+\{/gm, function(rules) {
                return rules.replace(/(^|,\s*)/g, '$1 .playground .output.frame .wrapper ');
            });

            if (oldHTML !== newHTML || oldCSS !== newCSS) {
                output.innerHTML = oldHTML = newHTML;
                style.textContent = oldCSS = newCSS;
            }

            updatetimeout = null;
        }
        
        playground.addEventListener('keyup', function(evt) {
            if (updatetimeout) {
                clearTimeout(updatetimeout);
            }
            updatetimeout = setTimeout(update, 500);
        });
        
        update();
        
        playground.setAttribute('data-processed', 'true');
    });
}

var sizeWeightAxisRanges = {
    // these are point values for now
    'AmstelvarAlpha': {
        '10': {
            '100': {
                XTRA: [370, 402, 402]
            },
            '210': {
                XTRA: [370, 402, 402]
            }
        },
        
        '14': {
            '100': {
                XTRA: [380, 402, 402]
            },
            '210': {
                XTRA: [302, 326, 342]
            }
        },
        
        '48': {
            '100': {
                XTRA: [325, 342, 359]
            },
            '210': {
                XTRA: [325, 342, 359]
            }
        }
    }
};


//pull axis info from typetools
var composites = {
    "opsz":{
        "10":{"XOPQ":110,"YOPQ":75,"YTLC":525},
        "14":[],
        "72":{"XTRA":300,"YOPQ":12,"YTLC":475}
    },"wdth":{
        "35":{"XTRA":42,"XOPQ":70,"YOPQ":45/* ,"PWDT":60 */},
        "100":[]
    },"wght":{
        "100":{"XOPQ":38,"YOPQ":25,"XTRA":375,"YTSE":8/* ,"PWGT":38 */},
        "400":[],
        "900":{"XOPQ":250,"XTRA":250,"YTLC":525/* ,"PWGT":250 */}
    }
};

//convert a set of axes from blended to all-parametric
window.allParametric = function(axes) {
    var axisDeltas = {};
    
    //special case for "relweight" specifying weight as % of default XOPQ
    // back-figure this to a `wght` value
    if ('relweight' in axes) {
        var baseXOPQ = axisDefaults.XOPQ + (axisDeltas.XOPQ || 0);
    
        //not sure if this should be based on the regular-default XOPQ, or the opsz-modified one
    //        var targetXOPQ = Math.round(baseXOPQ * axes.relweight.value/100);
        var targetXOPQ = Math.round(axisDefaults.XOPQ * axes.relweight/100);
    
        //back-figure wght value from XOPQ
        axes.wght = parametricToComposite('XOPQ', targetXOPQ, 'wght');
        delete axes.relweight;
    }
    
    axes.forEach(function(val, axis) {
        compositeToParametric(axis, val).forEach(function(v, k) {
            if (!(k in axisDeltas)) {
                axisDeltas[k] = 0;
            }
            axisDeltas[k] += v - axisDefaults[k];
        });
    });

    var result = {};
    axisDeltas.forEach(function(v, k) {
        result[k] = axisDefaults[k] + v;
    });
    
    return result;
};

window.compositeToParametric = function(caxis, cvalue) {
    cvalue = parseFloat(cvalue);
    
    if (!(caxis in composites)) {
        var temp = {};
        temp[caxis] = cvalue;
        return temp;
    }

    //maintain a list of all axes mentioned in the composite, so we can reset them all
    var allAxes = {};   
    
    var lowerPivot, upperPivot;
    var lowerAxes, upperAxes;
    //pivot value and axes
    composites[caxis].forEach(function(paxes, pivot) {
        pivot = parseFloat(pivot);
        
        //add any new axes to the list
        paxes.forEach(function(pval, paxis) {
            if (!(paxis in allAxes)) {
                allAxes[paxis] = globalAxes[paxis].default;
            }
        });
        
        if (pivot >= cvalue) {
            //first time this happens we can stop
            if (isNaN(upperPivot)) {
                upperPivot = pivot;
                upperAxes = paxes;
            }
        }
        
        if (isNaN(lowerPivot) || isNaN(upperPivot)) {
            //first runthru OR we still haven't found the top of the range
            lowerPivot = pivot;
            lowerAxes = paxes;
        }
    });

    if (isNaN(upperPivot)) {
        upperPivot = lowerPivot;
        upperAxes = lowerAxes;
    }

    var result = {};
    
    allAxes.forEach(function(dflt, axis) {
        var u = axis in upperAxes ? upperAxes[axis] : dflt;
        var l = axis in lowerAxes ? lowerAxes[axis] : dflt;
        var r = upperPivot === lowerPivot ? 0.0 : (cvalue-lowerPivot)/(upperPivot-lowerPivot);
        result[axis] = l + r*(u-l);
        if (globalAxes[axis].max - globalAxes[axis].min > 50) {
            result[axis] = Math.round(result[axis]);
        }
    });

    return result;
}

//given a value for a parametric axis, back-calculate the composite value that would produce it
window.parametricToComposite = function(paxis, pvalue, caxis) {
    if (!(caxis in composites)) {
        return null;
    }

    pvalue = parseFloat(pvalue);

    var mydefault = globalAxes[paxis].default;
    
    var lowerC, upperC;
    var lowerP, upperP;

    //pivot value and axes
    composites[caxis].forEach(function(paxes, pivot) {
        pivot = parseFloat(pivot);
        
        var myval = paxis in paxes ? paxes[paxis] : mydefault;

        if (myval >= pvalue) {
            //first time this happens we can stop
            if (isNaN(upperC)) {
                upperC = pivot;
                upperP = myval;
            }
        }
        
        if (isNaN(lowerC) || isNaN(upperC)) {
            //first runthru OR we still haven't found the top of the range
            lowerC = pivot;
            lowerP = myval;
        }
    });

    if (!upperC) {
        upperC = lowerC;
        upperP = lowerP;
    }

    if (upperC === lowerC) {
        return upperC;
    }

    var result = lowerC + (pvalue - lowerP)/(upperP - lowerP) * (upperC - lowerC);

    if (globalAxes[caxis].max - globalAxes[caxis].min > 50) {
        return Math.round(result);
    }
    
    return result;
}



window.getAxisRanges = function(targetsize, targetweight) {
//    var css = getComputedStyle(el);
//    var font = css.fontFamily.split(',')[0].trim().replace(/^['"]\s*/, '').replace(/\s*['"]$/, '').replace(/-VF$/, '').replace(/[\s\-]/g, '');
//    var targetsize = parseFloat(css.fontSize) * 3/4; //multiply by 3/4 if calibrated on points
//    var targetweight;
//    switch (css.fontWeight) {
//        case 'normal': targetweight=400; break;
//        case 'bold': targetweight=700; break;
//        default: targetweight = parseFloat(css.fontWeight) | 400; break;
//    }

    var font = 'AmstelvarAlpha';
    
    if (!(font in sizeWeightAxisRanges)) {
        return {};
    }
    
    var numsort = function(a,b) { return a - b; };

    //now we need to find the "anchor" sizes and weights on either side of the actual size and weight
    // so if our size/weight is 36/600, the anchors might be 14/400 and 72/700
    var sizes = Object.keys(sizeWeightAxisRanges[font]);
    sizes.sort(numsort);
    sizes.forEach(function(v,i) { sizes[i] = parseInt(v); });

    var lower = [sizes[0], 0], upper = [sizes[sizes.length-1], Infinity];
    var done = false;
    sizes.forEach(function(anchorsize) {
        if (done) {
            return;
        }

        var weights, weightdone;

        if (anchorsize <= targetsize) {
            //set lower and keep looking
            lower[0] = anchorsize;
        }

        if (anchorsize >= targetsize || anchorsize === upper[0]) {
            //found our upper size! Now search weights
            upper[0] = anchorsize;

            //find lower weight
            weights = Object.keys(sizeWeightAxisRanges[font][lower[0]]);
            weights.sort(numsort);
            weights.forEach(function(v,i) { weights[i] = parseInt(v); });
            weightdone = false;
            lower[1] = weights[0];
            weights.forEach(function(anchorweight) {
                if (weightdone) {
                    return;
                }
                if (anchorweight <= targetweight) {
                    lower[1] = anchorweight;
                }
                if (anchorweight >= targetweight) {
                    weightdone = true;
                }
            });

            //find upper weight
            weights = Object.keys(sizeWeightAxisRanges[font][upper[0]]);
            weights.sort(numsort);
            weights.forEach(function(v,i) { weights[i] = parseInt(v); });
            weightdone = false;
            upper[1] = weights[weights.length-1];
            weights.forEach(function(anchorweight) {
                if (weightdone) {
                    return;
                }
                if (anchorweight >= targetweight) {
                    upper[1] = anchorweight;
                    weightdone = true;
                }
            });
            
            done = true;
        }
    });

    //okay, now we have our lower and upper anchors!

    //how far bewteen lower and upper are we
    var sizeratio = upper[0] === lower[0] ? 0 : Math.max(0, Math.min(1, (targetsize - lower[0]) / (upper[0] - lower[0])));
    var weightratio = upper[1] === lower[1] ? 0 : Math.max(0, Math.min(1, (targetweight - lower[1]) / (upper[1] - lower[1])));
    
    //get axis values for the four corners
    var corners = {
        șẉ: sizeWeightAxisRanges[font][lower[0]][lower[1]],
        ŝẉ: sizeWeightAxisRanges[font][upper[0]][lower[1]],
        șẇ: sizeWeightAxisRanges[font][lower[0]][upper[1]],
        ŝẇ: sizeWeightAxisRanges[font][upper[0]][upper[1]]
    };
    
    //now we need to interpolate along the four edges
    var edges = {
        ș: [corners.șẇ, corners.șẉ, weightratio],
        ŝ: [corners.ŝẇ, corners.ŝẉ, weightratio],
        ẉ: [corners.ŝẉ, corners.șẉ, sizeratio],
        ẇ: [corners.ŝẇ, corners.șẇ, sizeratio]
    };

    edges.forEach(function(hlr, edge) {
        var high = hlr[0];
        var low = hlr[1];;
        var ratio = hlr[2];
        var middle = {};
        high.forEach(function(sml, axis) {
            middle[axis] = [];
            for (var i=0; i<3; i++) {
                middle[axis].push(low[axis][i] + (high[axis][i] - low[axis][i]) * ratio);
            }
        });
        edges[edge] = middle;
    });

    //now we can inter-interpolate between the interpolated edge values
    var axes = Object.keys(corners.șẉ);
    var result = {};
    axes.forEach(function(axis) {
        result[axis] = [];
        for (var i=0; i<3; i++) {
            result[axis].push(edges.ẉ[axis][i] + (edges.ẇ[axis][i] - edges.ẉ[axis][i]) * weightratio);
        }
    });

    return result;
};

window.testRanges = function() {
    var el = document.querySelector('#unique-specimen-8 span.rendered');
    var sizes = [9, 10, 12, 14, 24, 48, 60];
    var weights = [0.9, 1.0, 1.1, 1.55, 2.0, 2.1, 2.2];
    sizes.forEach(function(size) {
        weights.forEach(function(weight) {
            console.log(size, weight, JSON.stringify(getAxisRanges(size, weight)));
        });
    });
};

})();