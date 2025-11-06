class NSError extends Error {
    constructor(message, name = "Error", stackLines = []) {
        super(message);
        this.name = `Uncaught ${name}`;

        if (stackLines.length > 0) {
            // Build the stack string with proper indentation
            const formattedStack = stackLines.map(line => `    at ${line}`).join('\n');
            this.stack = `${name}: ${message}\n${formattedStack}`;
        }
        // Otherwise, default Error stack remains
    }
}
String.prototype.replaceLast = function(searchValue, replaceValue) {
    const lastIndex = this.lastIndexOf(searchValue);
    if (lastIndex === -1) return this.toString(); // nothing to replace
    return this.slice(0, lastIndex) + replaceValue + this.slice(lastIndex + searchValue.length);
};
String.prototype.replaceFirst = function(searchValue, replaceValue) {
    const firstIndex = this.indexOf(searchValue);
    if (firstIndex === -1) return this.toString(); // nothing to replace
    return this.slice(0, firstIndex) + replaceValue + this.slice(firstIndex + searchValue.length);
};
function sliceStringFunc(str, start, end) {
    if (typeof str !== 'string') throw new TypeError('First argument must be a string');

    let startIndex = typeof start === 'number' ? start : str.indexOf(start);
    if (startIndex === -1) throw new Error(`Start string "${start}" not found`);

    let endIndex;
    if (end === undefined) {
        endIndex = str.length;
    } else {
        endIndex = typeof end === 'number' ? end : str.indexOf(end, startIndex);
        if (endIndex === -1) throw new Error(`End string "${end}" not found`);
    }

    return str.slice(startIndex, endIndex);
}
String.prototype.sliceString = function(start, end) {
    let startIndex = typeof start === 'number' ? start : this.indexOf(start);
    if (startIndex === -1) throw new Error(`Start string "${start}" not found`);

    let endIndex;
    if (end === undefined) {
        endIndex = this.length;
    } else {
        endIndex = typeof end === 'number' ? end : this.indexOf(end, startIndex);
        if (endIndex === -1) throw new Error(`End string "${end}" not found`)
    }
    return this.slice(startIndex, endIndex)
}
function execute(code) {
    return new Function(code)(); // runs code in global scope
}
function convertFuncToJS(line) {
    return line.replace(/^func\s*\(\)\s*:/, 'function() {') + '}';  // Converts func() : to function() { ... }
}
function isVariable(name, scope = window) {
    return typeof scope[name] !== 'undefined';
}

function sentenceCase(text, assign = false, scope = window) {
    // Only modify if it's a string literal or variable name (not actual function)
    if (typeof text === 'string' && assign && isVariable(text, scope)) {
        const value = scope[text];
        if (typeof value === 'string') {
            scope[text] = value[0].toUpperCase() + value.slice(1).toLowerCase();
            return scope[text];
        }
        // If it's not a string, do nothing (skip)
        return value;
    }

    if (typeof text !== 'string') {
        throw new Error('sentenceCase() expects a string');
    }

    text = text.trim();
    if (text.length === 0) return '';
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
}
function evaluateExpression(expr, scope = {}) {
    // Replace custom operators before anything else
    expr = expr.replace(/\^\^/g, '**').replace(/\^/g, '**');

    // Replace variable names with scope values
    const safeExpr = expr.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (name) => {
        if (Object.prototype.hasOwnProperty.call(scope, name)) {
            return JSON.stringify(scope[name]);
        }
        return name;
    });

    try {
        const result = Function(`"use strict"; return (${safeExpr})`)();
        return result;
    } catch (err) {
        throw new Error(`NextScript: failed to evaluate '${expr}' — ${err.message}`);
    }
}

function parseHypToJS(nsCode, scope) {
    // Convert NextCode multiline backticks with interpolation to JS template literals
    nsCode = nsCode.replace(/`([\s\S]*?)`/g, (full, content) => {
        // Replace `${var}` with `${scope.var}`
        let replaced = content.replace(/\$\{([^}]+)\}/g, (_, expr) => `\${scope.${expr.trim()}}`);
        return '`' + replaced + '`';
    });
    const lines = nsCode.split('\n');
    const jsLines = [];
    const indentStack = [];
    let inCommentBlock = false; // track multi-line #[ ... ]# blocks

    // Convert Nextscript operators and checks to JS
    function convertLine(line) {
        // mask string literals first
        const stringMask = [];
        line = line.replace(/(["'`])((?:\\.|(?!\1).)*)\1/g, (match) => {
            stringMask.push(match);
            return `__STRING_PLACEHOLDER_${stringMask.length - 1}__`;
        });
    
        // logical operators
        line = line.replace(/\band\b/g, '&&')
                   .replace(/\bor\b/g, '||')
                   .replace(/\bnot\b/g, '!');
    
        // undefined checks
        line = line.replace(/\bis undefined\b/g, '=== undefined')
                   .replace(/\bis not undefined\b/g, '!== undefined');
    
        // remove trailing colon for JS
        line = line.replace(/:$/, '');
    
        // restore string literals
        line = line.replace(/__STRING_PLACEHOLDER_(\d+)__/g, (_, index) => stringMask[index]);
    
        return line;
    }
    
    for (let rawLine of lines) {
        const trimmed = rawLine.trim();
        if (!trimmed) continue;

        // handle multi-line #[ ... ]# comments
        if (inCommentBlock) {
            if (trimmed.includes(']#')) inCommentBlock = false;
            continue; // skip everything inside
        }
        if (trimmed.startsWith('#[')) {
            if (!trimmed.includes(']#')) inCommentBlock = true;
            continue;
        }

        // skip single-line comments
        if (trimmed.startsWith("#")) continue;

        const indent = rawLine.match(/^ */)[0].length;

        // Close blocks if indentation decreases
        while (indentStack.length && indent < indentStack[indentStack.length - 1])
            jsLines.push(' '.repeat(indentStack.pop()) + '}');

        // Ignore separator
        if (trimmed === '---') continue;

        // 'end' or '~~~' closes current block
        if (trimmed === 'end' || trimmed === '~~~') {
            if (indentStack.length) jsLines.push(' '.repeat(indentStack.pop()) + '}');
            continue;
        }
        
        // Function
        if (trimmed.startsWith('func ')) {
            const funcName = trimmed.slice(5, trimmed.indexOf('(')).trim();
            const params = trimmed.slice(trimmed.indexOf('(')+1, trimmed.indexOf(')')).trim();
            jsLines.push(`scope.${funcName} = function(${params}) {`);
            indentStack.push(indent);
            continue;
        }
        if (trimmed.startsWith('case ')) {
            const caseCall = trimmed.slice(5, trimmed.indexOf(':')).trim()
        }
        // For loop
        if (trimmed.startsWith('for ') && trimmed.includes(' of ')) {
            const forLine = trimmed.slice(4).replace(/:$/, '').trim();
            const [variable, iterable] = forLine.split(' of ').map(s => s.trim());
            jsLines.push(`for (let ${variable} of ${iterable}) {`);
            indentStack.push(indent);
            continue;
        }
        // If / else if / else
        if (trimmed.startsWith('if ')) {
            jsLines.push(`if (${convertLine(trimmed.slice(3))}) {`);
            indentStack.push(indent);
            continue;
        }

        // Else if
        if (trimmed.startsWith('else if ')) {
            jsLines.push(`else if (${convertLine(trimmed.slice(8))}) {`);
            indentStack.push(indent);
            continue;
        }

        // Else handling (ensure the else block is wrapped properly)
        if (trimmed === 'else:' || trimmed === 'else') {
            jsLines.push('else {');
            indentStack.push(indent);
            continue;
        }

        // While
        if (trimmed.startsWith('while ')) {
            jsLines.push(`while (${convertLine(trimmed.slice(6))}) {`);
            indentStack.push(indent);
            continue;
        }

        // Event handler fix for func call
        if (trimmed.includes('func()')) {
            jsLines.push(`function ${trimmed.slice(5)} {`);
            indentStack.push(indent);
            continue;
        }

        // Regular line
        jsLines.push(convertLine(trimmed));
    }

    // Close any remaining blocks
    while (indentStack.length) {
        jsLines.push(' '.repeat(indentStack.pop()) + '}');
    }

    return jsLines.join('\n');
}

// --- Scoped execution that keeps globals persistent ---
function runInScope(jsCode, scope) {
    const fn = new Function('scope', `
        with (scope) {
            ${jsCode}
        }
        return scope;
    `);
    fn(scope);
}

async function runNextscriptFromElements() {
    const scope = {}; // persistent scope

    // Builtins
    const builtins = document.querySelectorAll('script[type="text/ns"][data-builtins]');
    for (const script of builtins) {
        const code = script.src ? await fetch(script.src).then(r => r.text()) : script.textContent;
        const js = parseHypToJS(code, scope);  // pass outer scope
        runInScope(js, scope);
    }        

    // Normal scripts
    const scripts = document.querySelectorAll('script[type="text/ns"]:not([data-builtins])');
    for (const script of scripts) {
        const code = script.src ? await fetch(script.src).then(r => r.text()) : script.textContent;
        const js = parseHypToJS(code, scope);
        try { runInScope(js, scope); } 
        catch(err) { console.error(err); }        
    }    
}

document.addEventListener('DOMContentLoaded', runNextscriptFromElements);
