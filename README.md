# Object Detection by Nipa Nvision API

<img src="https://raw.githubusercontent.com/imekachi/nipa-nvision/master/demo-preview.png" alt="Nipa Nvision Object Detection" />

You can try out the [demo page here](https://nipa-nvision.imekachi.vercel.app/).


## Features
- Detect objects by using an image file
- Detect objects by using a Webcam (no option to switch camera on mobile *yet*)

## Local development mode
> API key for Nipa Nvision API is required.
1. clone this repo
```bash
$ git clone https://github.com/imekachi/nipa-nvision.git
```
2. Install dependencies
```bash
$ cd nipa-nvision
$ yarn
```
3. Create a file `.env.local` and add API key
```dosini
# .env.local
API_KEY=your_api_key_here
```
4. Start dev server
```bash
$ yarn dev
```
5. Open browser and go to [http://localhost:3000](http://localhost:3000)

## Resources
- [Nvision Object detection API](https://docs.nvision.nipa.cloud/how-to-guides/detect-objects)
