# ⚡ Geometry Dash - Game Clone

A feature-rich Geometry Dash-inspired game built with vanilla HTML5 Canvas and JavaScript.

## 🎮 Features

- **5 Handcrafted Levels** with increasing difficulty
- **Multiple Game Modes**: Cube, Ball (and more to come)
- **Obstacle Types**:
  - Spike obstacles
  - Gap jumps
  - Moving platforms
- **Collectible Coins** for bonus scoring
- **Star Rating System** (1-3 stars based on coin collection)
- **Smooth Physics** with gravity and jumping mechanics
- **Particle Effects** for visual feedback
- **Level Selection Menu**
- **Mobile-Friendly** controls (touch/tap support)
- **Beautiful UI** with gradient backgrounds and animations

## 🕹️ How to Play

1. Open `index.html` in your web browser
2. Click "Play" to select a level
3. Use **SPACE**, **Click**, or **Tap** to jump
4. Avoid obstacles and reach the end of the level
5. Collect coins for bonus points and to earn more stars
6. Complete all levels!

## 📊 Levels

1. **Stereo Madness** - Easy introduction to the game
2. **Back on Track** - Basic spike and gap obstacles
3. **Polargeist** - Normal difficulty with varied obstacles
4. **Dry Out** - Hard level with ball mode
5. **Baseline** - Very hard level with complex jumps

## 🎯 Scoring

- **Base Score**: +10 points per second of gameplay
- **Coins**: +100 points per coin collected
- **Star Rating**:
  - 1 Star: Completed level (50%+ coins)
  - 2 Stars: Good (50-80% coins)
  - 3 Stars: Perfect (80%+ coins)

## 🛠️ Technical Stack

- HTML5 Canvas for rendering
- Vanilla JavaScript (ES6+)
- RequestAnimationFrame for smooth 60 FPS
- Responsive design for desktop and mobile

## 🎨 Customization

You can easily customize levels by editing the `LEVEL_DATA` array in `game.js`:

```javascript
const level = {
  name: 'Your Level',
  difficulty: 'Easy',
  mode: MODES.CUBE,
  obstacles: [
    { type: 'spike', x: 400, size: 40 },
    { type: 'gap', x: 600, width: 80 },
    { type: 'platform', x: 800, width: 100, height: 40 }
  ],
  coins: [
    { x: 450, y: 200 }
  ],
  length: 2200
};
```

## 📱 Controls

| Input | Action |
|-------|--------|
| SPACE | Jump |
| Arrow Up | Jump |
| Mouse Click | Jump |
| Touch/Tap | Jump |

## 🚀 Future Enhancements

- Ship, Wave, and Robot modes
- Portals and teleporters
- Moving obstacles
- Sound effects and background music
- Leaderboard system
- Level editor
- More levels and challenges

## 📄 License

Free to use and modify for personal projects.

Enjoy! 🎉
