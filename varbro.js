(function() {
"use strict";

if (!window.doOnReady) {
    (function() { 
        var s = document.createElement('script');
        s.addEventListener('load', function() { doOnReady(varbroSetup); });
        s.src = "https://chrislewis.codes/js/polyfill.js";
        document.head.appendChild(s);
    })();
} else {
    doOnReady(varbroSetup);
}

function varbroSetup() {
    overrideTNJS();
    addNav();
    setupExamples();
    setupPlaygrounds();
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
        li.textContent = "Previous: ";
        li.appendChild(prev.cloneNode(true));
        ul.appendChild(li);
    }
    if (next) {
        li = document.createElement('li');
        li.textContent = "Next: ";
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
                    
                    specimen.querySelectorAll('span.rendered').forEach(function(span) {
                        var style = {};
                        var subspec = span.closest('.specimen');
                        style.tag = subspec.tagName.toLowerCase();
                        style.className = subspec.className.replace(/\b(specimen|single-line|editorial|paragraph)\b/g, '').replace(/\s+/g, ' ').trim();
                        style.css = span.getAttribute('style').trim().split(/\s*;\s*/);
                        styles.push(style);
 
                        codes.push('<' + style.tag + ' class="' + style.className + '">\n  ' + span.innerHTML.trim() + '\n</' + style.tag + '>');
                    });
 
                    styles.forEach(function(style, i) {
                        var classes = '.' + style.className.trim().replace(/\s+/g, '.');
                        classes = classes.replace(/\.(specimen|single-line|editorial|paragraph|has-label)/g, '');
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

})();