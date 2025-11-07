# NextCode Tutorial
## About
`NextCode`, otherwise known as `NextScript`, is an upgraded form of `JavaScript`, it is **easier to use**, and includes extra **built ins**, and **more**!
## Usage
### Preparing
- Make sure you have a `nextscript-loader.js` ([nextscript-loader on GitHub](https://github.com/Oscilllate/NextCode/blob/main/nextscript-loader.js))
- Get `builtins.nsh` ([builtins on GitHub](https://github.com/Oscilllate/NextCode/blob/main/builtins.nsh))
- Create a `.ns` file, and a `.html` file
- In your `.html` file, write as follows:
```HTML
<!DOCTYPE html> 
<html>
<head>
    <script src="nextscript-loader.js"></script>
    <script type="text/ns" src="builtins.nsh"></script>
    <script type="text/ns" src="YOUR_FILE_NAME.ns"></script>
</head>
<body>
</body>
</html>
```
- Write out your NS code!

### Syntax
- **Function**:
```
func greet(name = "stranger"):
    console.log("Hello, " + name)
~~~
```
- **`For` loop**:
```javascript
for i in 1..3:
   console.log("Hello") # Prints Hello three times
end
---
for key of Object.keys(someArray):
    console.log(someArray[key]) # logs the value of key in someArray
end
```
- **`If`/`Else`/`Else if`**:
```
if condition:
    # action
end
else if condition:
    # action
end
else:
    # action
end
```
- **Comments**:
```
# This is a single line comment!
#[ This
is
a multi
line comment ]#
```

### Running
- Open terminal
- Open GitHub file
- Type the following code in terminal:
```bash
cd "NextCode"
python -m http.server 8000
```
- Open localhost:8000 in your web browser
- Your code should run!