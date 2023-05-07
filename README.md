# @tty-pt/styles
> Cast your styles like a (good) wizard

Long story short:

This is another JSS library for React.<br />
Unlike (most) others, it doesn't rely on context.</br>
Instead, it just relies on normal class names.<br />

It is designed to be compatible with Material Design and MUI (v4 / v5 / v6).<br />
And so that we can more easily extract the generated styles into an external stylesheet.<br />

You can easily add Themes and global styles (and spells), and customize existing ones.

Eventually, you can move the styles dependency to live in one of your company's core react libs.<br />
And remove all magic from your application code!

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
import { createTheme, registerGetTheme, makeMagic, withMagic } from "@tty-pt/styles";

const colorTable = {
	["StatusSuccess", "#00ff00"],
};

const theme = createTheme({
	palette: {
		color: [{
			func: x => colorTable[x],
			length: colorTable.length,
		}],
	}
});

registerGetTheme(() => theme);

makeMagic({
	horizontal: {
		gap: "12px !important", // this will override original
	},
});

export default withMagic(function App() {
	const [themeName, setThemeName] = useState("light");

	function toggle() {
		setTheme(themeName === "light" ? "dark" : "light");
	}

	return (<div className={themeName + " horizontal"}>
		<span>hello<span>
		<span className="color-status-success">world<span>
		<button onClick={toggle}>test</button>
	</div>):
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
When used with a unit, usually the value is on the left, and the unit is on the right.

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
This label might mean "space-around", "space-between", "center", "start" (meaning flex-start) or "end" (meaning flex-end).
If you hide it it means "center".

### text-align
This can be "left", "right" or "center". Defaults to "center".

### cursor
This can be "resize", "horizontal-\<horizontal-cursor\>" or "vertical-\<vertical-cursor\>".

### horizontal-cursor
Defaults to "ew-resize".

### vertical-cursor
Defaults to "ns-resize".

### color
Color can be inherit, which is the default. it can also be black or white.
Color kind of depends on the context (well 2 colors).
If you omit the color label, and you are specifying a text color, you get the primary text color.
If you do the same while specifying a background color, you get the paper color.
Only in that first case (text color), might you specify "secondary".
While only in that second case (background color) you can use the "body" label.
Then, you have success, warning error and info.
For each of those you have main, light and dark.
You can also use colors specified via **color octaves** (see Theming section).

### table-layout
Defaults to "fixed".

### fontWeight
defaults to "bold" for now, meaning 600.

### angle
Defaults to "pi-over-two".

## Default Spells
Spells have two sorts of names or shapes:

- One is camelcased, in case you wish to do things that way.
- The other is with-dashes-like-this. This is prefered.

Here I will present mostly the dash-like syntax.

Spells can be inspired on CSS property keys and values, although this is not the case all the time.
Beware that this is based on a promise, and some of these spells might not work in certain combinations yet (this library is still a work in progress).

### 0: \<axis\>[-\<size\>[-neg]]
> Display this element with its children along \<axis\>, separated by \<size\>.

### 1: block[-\<axis\>][-\<size\>[-neg]]
> The same as 0 but does not use flex

### 2: table[-\<axis\>][-\<size\>[-neg]]
> The same as 0 but for tables

### 4: pad[-\<axis\>|-\<direction\>][-\<size\>][-neg]
> Add padding to this element in \<axis\> direction, of size \<size\>.
Neg can only be used along with with direction.

### 5: flex-grow[-children]
> This sets the element (or the element's children) to have a flex-grow property of 1.

### 6: flex-wrap
> Use this in conjunction with 0.

### 7: \<position\>
> Sets the position of the element to the label (meaning relative or absolute).

### 8: position-\<direction\>[-\<size\>[-neg]]
> Place the element in the specified \<direction\>, far from the edge by \<size\>.
> For use with absolute positioning and the like.

### 9: align-self[-\<align\>]
> This sets the element's property of align-self to the value of \<align\>.

### 10: align-items[-\<align\>]
> This sets the element's property of align-items to the value of \<align\>.
In this case \<align\> defaults to center.

### 11: justify-content[-\<justify\>]
> This sets the element's property of justifyContent to the value of \<justify\>.

### 12: [min-|max-|]size[-\<axis\>][-\<size\>]
> This sets the element's (default or maximum) size to be \<size\> in the specified axis.
> In this specific case, \<size\> can also be "full" meaning "100%".

### 13: text-align[-\<text-align\>]
> This sets the element's textAlign property to the value of \<text-align\>.

### 14: margin[-\<axis\>][-\<size\>[-neg]]
> I'm sure you can guess it at this point. I don't recomend using margins very often.

### 15: cursor[-\<cursor\>]
> Now the labels have the most important information.

### 16: color[-\<color\>]
> Sets the color property of the element.

### 17: background[-\<color\>]
> Sets the background-color property of the element.

### 18: border[-\<direction\>|-\<axis\>][-\<color\>]
> Sets the border in the specified direction or axis to be of the specified color.

### 19: table-layout[-\<table-layout\>]
> Set the element's table-layout property to the specified \<table-layout\>.

### 20: font-weight[-\<font-weight\>]
> Set the element's font-weight property to the specified \<font-weight\>.

### 21: rotate[-\<angle\>]
> Rotate this element by \<angle\>

### 22: overflow[-\<overflow\>]
> Apply \<overflow\> as value of overflow property.

## Theming
Like in MUI, we have a Theme type of object. It is very similar to the original structure:

```typescript
export type Css = { [key: string]: any };
export type OctaveFunc<P extends any> = (x: number) => [any, P];

export
interface OptOctave<P extends any> {
  func?: OctaveFunc<P>;
  min?: number;
  length?: number;
}

export
interface Octave<P extends any> extends OptOctave<P> {
  func: OctaveFunc<P>;
  min: number;
  length: number;
}

interface Color {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}

interface Palette {
  color: Octave<string>[],
  type: string;
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  error: Color;
  info: Color;
  divider: string;
  text: {
    primary: string;
    secondary: string;
  },
  background: {
    paper: string;
    default: string;
  }
}

export interface Theme {
  palette: Palette;
  spacing: OptOctave<string>[];
  typography: {
    htmlFontSize: number;
    fontFamily: string;
    fontSize: OptOctave<string>[],
    h1: Css;
    h2: Css;
    h3: Css;
    h4: Css;
    h5: Css;
    h6: Css;
    subtitle2: Css;
    caption: Css;
  };
}
```
The only part in which it differs is the color property of the palette object,<br />
the spacing prop of the theme, and the fontSize property of typography.

These are "Octaves", which means you can provide your own colors, spacings and fontSizes,<br />
and class names will be created for using these.

## Styling
makeMagic receives an object, bindMagic and useMagic receive an<br />
argument named "getStyle", which returns an object.<br />
This is similar to the callback you pass to makeStyles in MUI v4.<br />

This object will control which styles will be generated.<br />
For example the following call:
```javascript
makeMagic({
	specialCard: {
		color: "cyan",
		"&:hover": {
			color: "blue",
		}
	},
	"!MuiButton-root": {
		color: "red",
	},
	"?body": {
		backgroundColor: "gray",
	},
}, ".light ");
```
Will generate the styles:
```css
.light .special-card { color: "cyan"; }
.light .special-card:hover { color: "blue"; }
.light .MuiButton-root { color: "red"; }
body { background-color: "gray"; }
```

So:
- "&" will be replaced by the parent selector. It is useful for styling things in relation to a parent. It can only be used inside another selector.
- "!" will be replaced by ".". It means literal. It avoids transforming the keys from camel case to dashes.
- "?" means that we will declare a CSS rule exactly as stated after the "?".
- If you leave out the above, the class name will be transformed to dash format (assumed camel case).

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
