# dom-draggable
make dom element draggable


## Usage
```bash
yarn add dom-draggable
npm install dom-draggable
```

```js
// use as commonjs
const { setDraggable } = require("dom-draggable");

// use as ES module
import { setDraggable } from "dom-draggable";

const div = document.querySelector("#drag")
setDraggable(div);
```

## API
```js
setDraggable(domElement, options);

options = {
  // if true set position=absolute, else set poistion=fixed;
  relative: Boolean, 

  // if true use user cursor setting, else set cursor=move;
  keepCursor: Boolean, 

  // drag start event handler
  onDragStart(e) {

  },

  // drag move event handler
  onDragMove(e) {

  },

  // drag end event handler
  onDragEnd(e) {
    
  },
  
}
```

## Related Projects
+ https://github.com/taye/interact.js
+ https://github.com/Shopify/draggable
