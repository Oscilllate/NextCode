func el(type, attrs = {}):
    let element = document.createElement(type)
    
    for key of Object.keys(attrs):
        if key == "colour":
            element.style.color = attrs[key]
        end
        else if key in element.style:
            element.style[key] = attrs[key]
        end
        else:
            element[key] = attrs[key]
        end
    end    

    return element
~~~
---
func append(to, toAppend):
    return to.appendChild(toAppend)
~~~
---
func sel(selector):
    return document.querySelector(selector)
~~~
---
func selAll(selector):
    return document.querySelectorAll(selector)
~~~
---
func attachStyles(styles = {}, to):
    for key of Object.keys(styles):
        to.style[key] = styles[key]
    return to
~~~
---
func PTT(attachTo, methodName, method, options):
    #[ default options ]#
    if options is undefined:
        options = {}

    let to = attachTo
    to.prototype[methodName] = method
~~~
---
func defProperties(obj, props):
    for key of Object.keys(props):
        obj[key] = props[key]
~~~
func defProperty(obj, prop, fn):
    obj[prop] = fn
~~~
---
PTT(HTMLElement, "removeStyle", function() {
    this.removeAttribute('style')
    this.className = ''
    return this
})
---
func isEmpty(string):
    return not string or not string.trim
~~~
---
PTT(String, "upper", function() {
    return this.toUpperCase()
})
---
const logStyles = {
    INFO: 'color: green; font-weight: bold;',
    WARN: 'color: orange; font-weight: bold;',
    ERROR: 'color: red; font-weight: bold;',
    DEBUG: 'background-color: red; border-radius: 10px',
    USER: 'color: skyblue; font-weight: bold;',
    ADMIN: 'color: firebrick; font-weight: bold',
    TEST: 'color: blue; font-weight: bold;'
}

func log(message, prefix = '', style = '', wrapPrefix = false):
    if prefix != '':
        #[ uppercase and wrap prefix ]#
        prefix = '[' + prefix.upper() + ']'
        #[ choose prefix style: use user style if wrapPrefix is true, otherwise logStyles ]#
        prefixStyle = wrapPrefix ? style : (logStyles[prefix.replace(/[\[\]]/g, '')] || 'font-weight: bold;')
        #[ log prefix with prefixStyle, message with optional style ]#
        console.log('%c' + prefix + '%c ' + message, prefixStyle, style)
    end
    else:
        console.log(message)
    end
~~~
---
func debug(message):
    log(message, 'debug', 'color: #ff00f2ff; font-style: italic')
~~~
---
func open(link, dry = true):
    if typeof link != 'string':
        throw new NSError("TypeError", `Expected string, got ` + (typeof link), ["open (builtins.nsh:96:11)"])
    end
    if not dry:
        window.location.href = link
    end
    else:
        if confirm("You are opening a 3rd party link, and are about to leave this site, are you sure you want to continue?"):
            window.location.href = link
        end
    end
~~~
---
func tutorial():
    open("Nextscript%20Tutorial.pdf", true)
~~~
---
maths = {
    add: function(x, y) {
        return x + y
    },

    multiply: function(...numbers) {
        result = 1
        for num of numbers:
            result *= num
        end
        return result
    },
    divide: function(...numbers) {
        if numbers.length == 0:
            return 0
        end
    
        result = numbers[0]
        for num of numbers.slice(1):
            result /= num
        end
    
        return result
    }
}
---
func solve(equation):
    equation = equation.replace('"', '').replace("'", '')
    return evaluateExpression(equation)
~~~
---
func setIcon(filePath):
    old = document.querySelector('link[rel="icon"]')
    newHref = filePath + '?v=' + Date.now()
    
    if old:
        old.href = newHref
    end
    else:
        icon = el('link', { rel: "icon", href: newHref })
        document.head.appendChild(icon)
    end
~~~
func removeIcon():
    icon = document.querySelector('link[rel="icon"]')
    if icon:
        icon.remove()
    end
~~~
---