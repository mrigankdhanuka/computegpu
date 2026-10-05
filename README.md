# computegpu.world landing page

React and Vite landing page for the domain sale.

## Run locally

```sh
npm install
npm run dev
```

## Connect the offer form

The form uses [Web3Forms](https://web3forms.com). Create an access key, then add it to the `.env` file in the project root:

```sh
VITE_WEB3FORMS_ACCESS_KEY=your_access_key
```

Restart the development server after changing the environment file. Vite exposes `VITE_` values to the browser, so the access key is public by design. Without a key, the form reports that it is unavailable and does not send a request.

## Build

```sh
npm run build
```
