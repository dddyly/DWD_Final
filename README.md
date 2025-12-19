# 4th dimension project

an interactive web application that collects people's interpretations of "what does the 4th dimension mean to you?" users can submit their thoughts and interact with previous responses by dragging them around a 2d space.

## features

- minimalist black and white design
- content filtering for inappropriate submissions
- draggable responses in 2d space
- persistent positioning across sessions
- mobile and desktop support

## tech stack

- **backend**: node.js, express, sqlite
- **frontend**: vanilla html/css/javascript
- **content filter**: bad-words npm package
- **drag system**: custom mouse/touch event handlers

## setup instructions

### prerequisites

- node.js (v14 or higher)
- npm

### installation

1. navigate to the project directory:
```bash
cd ~/Desktop/4th-dimension-project
```

2. install dependencies (already done):
```bash
npm install
```

### running the application

start the server:
```bash
npm start
```

for development with auto-restart:
```bash
npm run dev
```

the application will be available at: `http://localhost:3000`

## usage

1. open `http://localhost:3000` in your browser
2. read the prompt: "what does the 4th dimension mean to you?"
3. type your interpretation in the text field
4. click submit
5. explore all previous responses by dragging them around the canvas
6. click "refresh responses" to see new submissions from others
7. click "add another" to submit a new response

## project structure

```
4th-dimension-project/
├── server/              # backend code
│   ├── index.js         # express server
│   ├── database.js      # sqlite operations
│   ├── filter.js        # content filtering
│   └── routes/
│       └── responses.js # api endpoints
├── public/              # frontend code
│   ├── index.html       # main page
│   ├── css/
│   │   └── style.css    # styles
│   └── js/
│       ├── app.js       # main app logic
│       └── dragHandler.js # drag functionality
├── database/            # sqlite database
│   └── responses.db     # (auto-generated)
└── package.json         # dependencies
```

## api endpoints

- `GET /api/responses` - fetch all responses with positions
- `POST /api/responses` - submit new response (with content filtering)
- `PUT /api/responses/:id/position` - update response position

## content filtering

the application filters:
- profanity and offensive language
- urls and links
- email addresses
- phone numbers
- excessive capitalization
- excessive character repetition

responses must be between 1 and 500 characters.

## development

to modify the application:

- **backend logic**: edit files in `server/`
- **frontend ui**: edit `public/index.html` and `public/css/style.css`
- **frontend logic**: edit files in `public/js/`
- **database schema**: modify `server/database.js`

## database

sqlite database stores:
- response text
- x/y position on canvas
- creation and update timestamps

responses are positioned randomly with collision detection to prevent overlapping.

## future enhancements

- real-time position updates via websockets
- color-coding for similar themes
- export canvas as image
- admin moderation panel
- response clustering visualization
- search and filter functionality

## license

MIT
# DWD_Final
