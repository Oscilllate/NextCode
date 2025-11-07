# NextCode
## Project Structure
```
NextCode/
├── index.html
├── nextscript.ns
├── nextscript-loader.js
├── builtins.nsh
├── SESSION.md
├── NextCode Tutorial.md
└── README.md
```
## About
**NextCode**, otherwise known as **NextScript**, is an upgraded version of JavaScript.
It includes **easier to read/code syntax**.
It was created as a mix of `Python`, `Swift`/`SwiftUI`, and `JavaScript`.
### `Python`:
- Syntax
### `Swift`/`SwiftUI`:
- Functions
- Interface
### `JavaScript`:
- Function bodies
- Parser
## Getting started
### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python
- A coding interface (Any text editor)
### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NextCode
   ```
2. Open start a localhost:
   ```bash
   python -m http.server 8000 # Starts a private website at localhost:8000
   ```
3. Go to `localhost:8000` on a modern web browser
   
### Usage

1. **Code**: Open `nextscript.ns` and write your code.
2. **Run**: Reload your web browser and the code you wrote should run.
3. Check `builtins.nsh` for seeing built in functions.

#### Syntax
- **Function**:
  ```
  func <name>(<params>):
      <code>
  ~~~
  ```
- **Variable**: `<varName>` = `<someValue>`
- **If/else if/else**:
  ```
  if condition:
     <code>
  end
  else if condition:
     <code>
  end
  else:
     <code>
  end
  ```
- **For**:
  ```
  for i in x..y:
     <code>
  end
  for key of Object.keys(<someArray>):
     <code>
  end
  ```
  
## Technology stack
- **HTML5**: Base view
- **NS1**: NextScript

### See `NextCode Tutorial.md` for more information
## Contributions
Contributions are welcome! Please feel free to submit issues or pull requests.

## License
This project is open source and available under the MIT License.

