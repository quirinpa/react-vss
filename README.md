# @tty-pt/styles
> Cast your styles like a (good) wizard

Your stack is full of bad vibes and old dependencies.<br />
You are stuck with MUI v4 and react <17 because you are using JSS all over the place,<br />
but new react no longer supports it.<br />
Ok. So I have a trick for you: Why don't you use @tty-pt/styles?

With styles, you can still use MUI v4 style JSS (and close JS interface),<br />
while actually using v5 in the backend, and react 17.<br />
Also, everything is done via regular CSS.<br />
So no strange class names that are random and too specific - styles has good practices built into it.

The tradeoff? For a while your app will be full of magic.<br />
Meaning you will have a lot of places in your code where new CSS may be inserted (this happened with MUI v4 as well).

But - it is a stepping stone.<br />
You no longer have to update all of the code at once.<br />
if you owed multiple libraries, you were out of luck until types.

You can easily add Themes and global styles (and spells).

As a plus, it is totally possible to keep cleaning up your code until you got<br />
a stylesheet you can serve directly from the server.

Eventually, you can move the styles dependency to live in one of your company's core react libs.<br />
And remove all magic from your application code!

Moreover, you can remove the styles dependency entirely in the end. And just use pre-baked CSS.<br />
The next version will be react 17, at least!

## Installation
```sh
npm i --save-dev @tty-pt/styles # if you are developing a library add it also as a peer dependency.
```

## Simple example
```js
import React from "react";
import "@tty-pt/styles"

export default
function App() {
	// the div will have a padding of 16px
	// and horizontal (and vertical) separatiions of 16px
	return (<>
		<div className="horizontal pad">
			<span>1</span>
			<span>2</span>
			<span>3</span>
		</div>
	</>):
}
```

## Slightly more advanced example
```js
import React from "react";
import { createTheme, makeMagic, withMagic } from "@tty-pt/styles";

const theme = createTheme({
	palette: {
		status: {
			success: "#00ff00",
		}
	}
});

makeMagic({
	horizontal: {
		gap: "12px !important",
	},
});

export default withMagic(function App() {
	const [themeName, setThemeName] = useState("light");

	useMagic(theme => ({
		colorStatusSuccess: { // this is a new spell
			color: theme.palette.status.success,
	        }
	}));

	function toggle() {
		setTheme(theme === "light" ? "dark" : "light");
	}

	return (<div className={theme + " horizontal"}>
		<span>hello<span>
		<span className="color-status-success">world<span>
		<button onClick={toggle}>test</button>
	</div>):
}, {
	"@tty-pt/styles": { getTheme: () => theme },
});
```
This library is designed to be compatible with material-ui.
There are other lower level APIs as well.
We will attempt to generate more extensive documentation in the future.

## Labels and values

### axis
Axis can be horizontal or vertical. In some situations it can be omitted (meaning all axis).

### size
Size can be the default (unit) size, which is usually when the label is omitted.
It can also be small (half) or big (double), smallest (a fourth) or biggest (quadruple).
Size can also be 0. When you apply "neg" after the size label, it negates the value.

### position
Position can be relative or absolute

### Special Position (the position keyword)
There is also a sort of position for setting the element to the top, to the right, etc.
This will be discussed later.

### direction
Direction can be top, left, right or bottom.

### align
Align can be stretch, center, end (meaning flex-end) or start (meaning flex-start).
If you hide this label, it usually means stretch.

### justify
This label might mean space-between, center, start (meaning flex-start) and end (meaning flex-end).
If you hide it it means center.

### text-align
This can be "left", "right" or "center".

### cursor
This can be "resize", "horizontal-\<horizontal-cursor\>" or "vertical-\<vertical-cursor\>".

### horizontal-cursor
This can be "resize" meaning "ew-resize".

### vertical-cursor
This can be "resize" meaning "ns-resize".

### color
Color can be inherit, which is the default. it can also be black or white.
In fact all of the colors of the palette of MUI can be used.
The default is "main" in cases where the color is divided. But you can also specify "light".

### table-layout
This can only be "fixed" for now. This is the default.

### fontWeight
This can only be "bold" for now, meaning 600. This is the default.

### angle
This can be piOverTwo. Default.

## Default Spells
Spells have two sorts of names or shapes:

- One is camelcased (the one you use to define your styles).
- The other is dashes like-this. This is what we use for classNames.

Here I will present mostly the dash-like syntax (it will be more common in the code).

Spells can be inspired on CSS property keys and values, although this is not the case all the time.
Beware that this is based on a promise, and some of these spells might not work in certain combinations yet (this library is still a work in progress).

### 0: \<axis\>[-\<size\>[-neg]]
> Display this element with its children along \<axis\>, separated by \<size\>.

### 1: block[-\<axis\>][-\<size\>[-neg]]
> The same as 0 but does not use flex

### 2: table[-\<axis\>][-\<size\>[-neg]]
> The same as 0 but for tables

### 4: pad[-\<axis\>][-\<size\>]
> Add padding to this element in \<axis\> direction, of size \<size\>.

### 5: flex-grow[-children]
> This sets the element (or the element's children) to have a flex-grow property of 1.

### 6: flex-wrap
> Use this in conjunction with 0.

### 6: \<position\>
> Sets the position of the element to the label (meaning relative or absolute).

### 7: position-\<direction\>[-\<size\>[-neg]]
> Place the element in the specified \<direction\>, far from the edge by \<size\>.
> For use with absolute positioning and the like.

### 8: align-self[-\<align\>]
> This sets the element's property of align-self to the value of \<align\>.

### 9: align-items[-\<align\>]
> This sets the element's property of align-items to the value of \<align\>.

### 10: justify-content[-\<justify\>]
> This sets the element's property of justifyContent to the value of \<justify\>.

### 11: size[-max][-\<axis\>][-\<size\>]
> This sets the element's (default or maximum) size to be \<size\> in the specified axis.
> In this specific case, \<size\> can also be "full" meaning "100%".

### 12: text-align[-\<text-align\>]
> This sets the element's textAlign property to the value of \<text-align\>.

### 13: margin[-\<axis\>][-\<size\>[-neg]]
> I'm sure you can guess it at this point. I don't recomend using margins very often.

### 14: cursor[-\<cursor\>]
> Now the labels have the most important information.

### 15: color[-\<color\>]
> Sets the color property of the element.

### 15: background[-\<color\>]
> Sets the background-color property of the element.

### 16: border[-\<direction\>|-\<axis\>][-\<color\>]
> Sets the border in the specified direction or axis to be of the specified color.

### 17: table-layout[-\<table-layout\>]
> Set the element's table-layout property to the specified \<table-layout\>.

### 18: font-weight[-\<font-weight\>]
> Set the element's font-weight property to the specified \<font-weight\>.

### 19: rotate[-\<angle\>]
> Rotate this element by \<angle\>

### 20: overflow[-\<overflow\>]
> Apply \<overflow\> as value of overflow property.

## Building
You can build this library by using [pnpm](https://pnpm.io/installation) instead of npm.

Clone this repo, cd into its directory. and "pnpm i".

To build in production mode:
```sh
pnpm build
```

And to start webpack watch:
```sh
pnpm watch
```

I think that's the most important.
