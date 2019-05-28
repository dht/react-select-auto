A simple select for react with i18n support and autocomplete.

## Demo

https://dht.github.io/react-select-auto/

## Usage

```jsx
<Select
  placeholder="lofs"
  options={options}
  value={value}
  name="lofId"
  onChange={this.onChange}
/>
```

## Install

### npm

```bash
npm install --save react-select-auto
```

### yarn

```bash
yarn add react-select-auto
```

## API

### Props

#### `options: Array`

The items to display in the dropdown menu with "id" and "title" fields.

#### `value: String or Int`

The id of the selected value

#### `onChange: Function` (optional)

Default value: `function() {}`

Arguments: `event: Event, value: String`

Invoked every time the user changes the input's value.

#### `placeholder: Text` (optional)

The placeholder text to display when no option is selected

#### `maxWidth: int` (optional)

Default value: `250px`

The max-width of the list overlay

# Development

You can start a local development environment with `npm start`. This command starts a create-react-app examples application

## Scripts

Run with `npm run <script>`.

### release

```bash
gulp publish
```

### build

```bash
gulp
```

### publish docs (examples)

```bash
npm run deploy
```
