import type { Level } from '../types'

export const levels: Level[] = [
  {
    id: 1,
    title: "1: Baby's First Center",
    description: "Center this div horizontally. Your cat could literally do this.",
    initialHTML: '<div class="container">\n  <div class="target">🐱</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #ff6b6b;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'Think about margins... what happens when you tell the left and right margins to figure themselves out? 🤔',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #ff6b6b;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  margin: 0 auto;\n}',
    explanation: 'The magic of "margin: 0 auto" works because when you set left and right margins to "auto", they automatically calculate equal values to center the element horizontally within its container. The "0" sets top and bottom margins to zero.'
  },
  {
    id: 2,
    title: "2: Add Vertical Too",
    description: "Now center it both ways using flexbox",
    initialHTML: '<div class="container">\n  <div class="target">🎯</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #4ecdc4;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'The container needs to become flexible... think about how to justify content and align items when things get flexed 💪',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #4ecdc4;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    explanation: 'Flexbox is the modern way to center! When you set "display: flex" on the container, "justify-content: center" centers horizontally and "align-items: center" centers vertically. Think of it as controlling the main axis (horizontal) and cross axis (vertical).'
  },
  {
    id: 3,
    title: "3: Grid Power",
    description: "Same result, but use CSS Grid instead",
    initialHTML: '<div class="container">\n  <div class="target">⭐</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #45b7d1;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'Time to think in grids! There\'s a shorthand property that can place items exactly where you want them ⭐',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  display: grid;\n  place-items: center;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #45b7d1;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    explanation: 'CSS Grid\'s "place-items: center" is a powerful shorthand that combines "align-items: center" and "justify-items: center". It centers grid items both horizontally and vertically in one line! Grid is especially useful for more complex layouts.'
  },
  {
    id: 4,
    title: "4: Absolute Beginner",
    description: "Center using absolute positioning",
    initialHTML: '<div class="container">\n  <div class="target">🚀</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #9b59b6;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'Sometimes you need to break free from the normal flow. Position yourself halfway, then use a transformation to account for your own size 🚀',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  position: relative;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #9b59b6;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}',
    explanation: 'This classic technique uses absolute positioning to place the element at 50% from top and left, then uses "transform: translate(-50%, -50%)" to shift it back by half its own width and height. It works because transform percentages are relative to the element itself!'
  },
  {
    id: 5,
    title: "5: Text-Align Hack",
    description: "Center an inline-block element with text-align",
    initialHTML: '<div class="container">\n  <div class="target">💎</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #e67e22;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'Think old school! How do you center text? And what if your target wasn\'t a block? You might need a ghost friend to help with vertical alignment 👻',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  text-align: center;\n}\n\n.container::before {\n  content: "";\n  height: 100%;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #e67e22;\n  border-radius: 8px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  vertical-align: middle;\n}',
    explanation: 'This old-school trick uses "text-align: center" for horizontal centering, then creates an invisible pseudo-element (::before) that\'s as tall as the container. Both the pseudo-element and target use "vertical-align: middle" to center vertically. It\'s like having an invisible tall friend help you center!'
  },
  {
    id: 6,
    title: "6: Table Cell Vibes",
    description: "Use table-cell display for centering",
    initialHTML: '<div class="container">\n  <div class="target">🔥</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #e74c3c;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'Before flexbox existed, how did table cells center their content? Make your container behave like one! 🔥',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  display: table-cell;\n  text-align: center;\n  vertical-align: middle;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #e74c3c;\n  border-radius: 8px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    explanation: 'By making the container behave like a table cell with "display: table-cell", you can use table centering properties! "text-align: center" handles horizontal centering and "vertical-align: middle" handles vertical. This was a popular pre-flexbox technique.'
  },
  {
    id: 7,
    title: "7: CSS Calc() Wizard",
    description: "Center using calc() with absolute positioning",
    initialHTML: '<div class="container">\n  <div class="target">⚡</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #f1c40f;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'Math time! If you know your element\'s size, you can calculate exactly where 50% minus half your size lands ⚡',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  position: relative;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #f1c40f;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  position: absolute;\n  top: calc(50% - 25px);\n  left: calc(50% - 25px);\n}',
    explanation: 'CSS calc() lets you do math! Here we calculate "50% - 25px" where 50% is the center point and 25px is half the element\'s width/height (50px ÷ 2). This positions the top-left corner of our element so that its center aligns with the container\'s center. Math FTW!'
  },
  {
    id: 8,
    title: "8: Margin Auto Magic",
    description: "Center with margin: auto on all sides using absolute positioning",
    initialHTML: '<div class="container">\n  <div class="target">🌟</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #16a085;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n}',
    hint: 'What if you stretched your element to fill all sides, then let margins do the magic? Sometimes being everywhere means being centered 🌟',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  position: relative;\n}\n\n.target {\n  width: 50px;\n  height: 50px;\n  background: #16a085;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: auto;\n}',
    explanation: 'This is a clever absolute positioning trick! By setting all four directions (top, left, right, bottom) to 0, you\'re telling the element to stretch to fill the entire container. But since it has a fixed width/height, "margin: auto" resolves the conflict by centering it perfectly. Mind = blown! 🤯'
  },
  {
    id: 9,
    title: "9: Multiple Targets",
    description: "Center multiple divs both horizontally and vertically",
    initialHTML: '<div class="container">\n  <div class="target">🎪</div>\n  <div class="target">🎭</div>\n  <div class="target">🎨</div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  width: 40px;\n  height: 40px;\n  background: #8e44ad;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 16px;\n  margin: 5px;\n}',
    hint: 'Multiple targets need organization! Think about direction and how to arrange them while keeping them centered as a group 🎪',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n}\n\n.target {\n  width: 40px;\n  height: 40px;\n  background: #8e44ad;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 16px;\n  margin: 5px;\n}',
    explanation: 'Flexbox shines with multiple elements! "flex-direction: column" stacks items vertically, while "justify-content: center" and "align-items: center" center the entire group as one unit. The individual margins (5px) create nice spacing between items. It\'s like centering a perfectly organized stack!'
  },
  {
    id: 10,
    title: "10: CSS Ninja Final Boss",
    description: "Center a responsive element using modern CSS features",
    initialHTML: '<div class="container">\n  <div class="target">\n    <div class="inner">🥷</div>\n    <div class="text">CSS NINJA</div>\n  </div>\n</div>',
    initialCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n}\n\n.target {\n  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);\n  border-radius: 12px;\n  padding: 20px;\n  color: white;\n  text-align: center;\n}\n\n.inner {\n  font-size: 32px;\n  margin-bottom: 8px;\n}\n\n.text {\n  font-size: 12px;\n  font-weight: bold;\n  letter-spacing: 2px;\n}',
    hint: 'Final boss mode! Combine the power of grids with responsive sizing that clamps between boundaries. Add some shadow magic for style 🥷',
    solutionCSS: '.container {\n  width: 300px;\n  height: 300px;\n  border: 2px solid #333;\n  background: #f0f0f0;\n  display: grid;\n  place-items: center;\n}\n\n.target {\n  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);\n  border-radius: 12px;\n  padding: 20px;\n  color: white;\n  text-align: center;\n  width: clamp(120px, 60%, 200px);\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);\n}\n\n.inner {\n  font-size: 32px;\n  margin-bottom: 8px;\n}\n\n.text {\n  font-size: 12px;\n  font-weight: bold;\n  letter-spacing: 2px;\n}',
    explanation: 'Welcome to CSS ninja status! This combines grid centering with modern responsive design. "clamp(120px, 60%, 200px)" creates a responsive width: minimum 120px, preferred 60% of container, maximum 200px. Add a gradient background, box-shadow, and perfect typography - you\'ve mastered both centering AND style! 🥷'
  }
]