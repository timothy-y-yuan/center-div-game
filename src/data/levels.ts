import type { Level } from '../types';
import { createLevelId } from '../utils/typeHelpers';

export const levels: Level[] = [
  {
    id: createLevelId(1),
    title: "1: Baby's First Center",
    description:
      'Center this div horizontally using margins. The most basic centering technique!',
    initialHTML:
      '<div class="container">\n  <div class="target">🐱</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #ff6b6b;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.target': {
        lockedProperties: [
          'width',
          'height',
          'background',
          'border-radius',
          'font-size',
          'text-align',
          'line-height',
        ],
        allowedProperties: ['*'],
        initialEditableCSS: '  /* come on. just center me. */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: false,
    },
    constraints: 'You can only modify the .target selector.',
    hint: 'Think about margins... what happens when you tell the left and right margins to figure themselves out? 🤔',
    solutionCSS: `.target {
  margin: 0 auto;
}`,
    explanation:
      'The magic of "margin: 0 auto" works because when you set left and right margins to "auto", they automatically calculate equal values to center the element horizontally within its container. The "0" sets top and bottom margins to zero.',
    difficulty: 'beginner',
    tags: ['margin', 'horizontal-centering', 'basics'],
  },
  {
    id: createLevelId(2),
    title: '2: Add Vertical Too',
    description:
      'Center both horizontally AND vertically using flexbox on the container.',
    initialHTML:
      '<div class="container">\n  <div class="target">🎯</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #4ecdc4;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can only modify the .container selector.',
    hint: 'The container needs to become flexible... think about how to justify content and align items when things get flexed 💪',
    solutionCSS: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
    explanation:
      'Flexbox is the modern way to center! When you set "display: flex" on the container, "justify-content: center" centers horizontally and "align-items: center" centers vertically. Think of it as controlling the main axis (horizontal) and cross axis (vertical).',
    difficulty: 'beginner',
    tags: ['flexbox', 'justify-content', 'align-items', 'modern'],
  },
  {
    id: createLevelId(3),
    title: '3: Grid Power',
    description: 'Center using CSS Grid - the most powerful layout system!',
    initialHTML:
      '<div class="container">\n  <div class="target">⭐</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #45b7d1;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can only modify the .container selector.',
    hint: "Time to think in grids! There's a shorthand property that can place items exactly where you want them ⭐",
    solutionCSS: `.container {
  display: grid;
  place-items: center;
}`,
    explanation:
      'CSS Grid\'s "place-items: center" is a powerful shorthand that combines "align-items: center" and "justify-items: center". It centers grid items both horizontally and vertically in one line! Grid is especially useful for more complex layouts.',
    difficulty: 'beginner',
    tags: ['grid', 'place-items', 'modern', 'shorthand'],
  },
  {
    id: createLevelId(4),
    title: '4: Absolute Beginner',
    description:
      'Center using absolute positioning and transforms - break free from normal flow!',
    initialHTML:
      '<div class="container">\n  <div class="target">🚀</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #9b59b6;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
      '.target': {
        lockedProperties: [
          'width',
          'height',
          'background',
          'border-radius',
          'font-size',
          'text-align',
          'line-height',
        ],
        allowedProperties: ['*'],
        initialEditableCSS: '  /* come on. just center me. */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can modify both .container and .target selectors.',
    hint: 'Sometimes you need to break free from the normal flow. Position yourself halfway, then use a transformation to account for your own size 🚀',
    solutionCSS: `.container {
  position: relative;
}

.target {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
    explanation:
      'This classic technique uses absolute positioning to place the element at 50% from top and left, then uses "transform: translate(-50%, -50%)" to shift it back by half its own width and height. It works because transform percentages are relative to the element itself!',
    difficulty: 'intermediate',
    tags: ['absolute-positioning', 'transform', 'translate', 'classic'],
  },
  {
    id: createLevelId(5),
    title: '5: Text-Align Hack',
    description:
      'Center using old-school text-align and inline-block techniques.',
    initialHTML:
      '<div class="container">\n  <div class="target">💎</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #e67e22;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
      '.container::before': {
        lockedProperties: [],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
      '.target': {
        lockedProperties: [
          'width',
          'height',
          'background',
          'border-radius',
          'font-size',
          'text-align',
          'line-height',
        ],
        allowedProperties: ['*'],
        initialEditableCSS: '  /* come on. just center me. */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints:
      'You can modify .container, .container::before, and .target selectors.',
    hint: "Think old school! How do you center text? And what if your target wasn't a block? You might need a ghost friend to help with vertical alignment 👻",
    solutionCSS: `.container {
  text-align: center;
}

.container::before {
  content: "";
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}

.target {
  display: inline-block;
  vertical-align: middle;
}`,
    explanation:
      'This old-school trick uses "text-align: center" for horizontal centering, then creates an invisible pseudo-element (::before) that\'s as tall as the container. Both the pseudo-element and target use "vertical-align: middle" to center vertically. It\'s like having an invisible tall friend help you center!',
    difficulty: 'intermediate',
    tags: ['text-align', 'pseudo-elements', 'vertical-align', 'old-school'],
  },
  {
    id: createLevelId(6),
    title: '6: Table Cell Vibes',
    description: 'Center using table-cell display - old but reliable!',
    initialHTML:
      '<div class="container">\n  <div class="target">🔥</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #e74c3c;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
      '.target': {
        lockedProperties: [
          'width',
          'height',
          'background',
          'border-radius',
          'font-size',
          'text-align',
          'line-height',
        ],
        allowedProperties: ['*'],
        initialEditableCSS: '  /* come on. just center me. */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can modify both .container and .target selectors.',
    hint: 'Before flexbox existed, how did table cells center their content? Make your container behave like one! 🔥',
    solutionCSS: `.container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.target {
  display: inline-block;
}`,
    explanation:
      'By making the container behave like a table cell with "display: table-cell", you can use table centering properties! "text-align: center" handles horizontal centering and "vertical-align: middle" handles vertical. This was a popular pre-flexbox technique.',
    difficulty: 'intermediate',
    tags: ['table-cell', 'text-align', 'vertical-align', 'legacy'],
  },
  {
    id: createLevelId(7),
    title: '7: CSS Calc() Wizard',
    description:
      'Center using calc() with absolute positioning - math meets CSS!',
    initialHTML:
      '<div class="container">\n  <div class="target">⚡</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #f1c40f;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
      '.target': {
        lockedProperties: [
          'width',
          'height',
          'background',
          'border-radius',
          'font-size',
          'text-align',
          'line-height',
        ],
        allowedProperties: ['*'],
        initialEditableCSS: '  /* come on. just center me. */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can modify both .container and .target selectors.',
    hint: "Math time! If you know your element's size, you can calculate exactly where 50% minus half your size lands ⚡",
    solutionCSS: `.container {
  position: relative;
}

.target {
  position: absolute;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
}`,
    explanation:
      'CSS calc() lets you do math! Here we calculate "50% - 25px" where 50% is the center point and 25px is half the element\'s width/height (50px ÷ 2). This positions the top-left corner of our element so that its center aligns with the container\'s center. Math FTW!',
    difficulty: 'advanced',
    tags: ['calc', 'absolute-positioning', 'math', 'precise'],
  },
  {
    id: createLevelId(8),
    title: '8: Margin Auto Magic',
    description: 'Advanced absolute positioning with margin auto on all sides.',
    initialHTML:
      '<div class="container">\n  <div class="target">🌟</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 50px;
  height: 50px;
  background: #16a085;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
      '.target': {
        lockedProperties: [
          'width',
          'height',
          'background',
          'border-radius',
          'font-size',
          'text-align',
          'line-height',
        ],
        allowedProperties: ['*'],
        initialEditableCSS: '  /* come on. just center me. */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can modify both .container and .target selectors.',
    hint: 'What if you stretched your element to fill all sides, then let margins do the magic? Sometimes being everywhere means being centered 🌟',
    solutionCSS: `.container {
  position: relative;
}

.target {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}`,
    explanation:
      'This is a clever absolute positioning trick! By setting all four directions (top, left, right, bottom) to 0, you\'re telling the element to stretch to fill the entire container. But since it has a fixed width/height, "margin: auto" resolves the conflict by centering it perfectly. Mind = blown! 🤯',
    difficulty: 'advanced',
    tags: ['absolute-positioning', 'margin-auto', 'all-directions', 'clever'],
  },
  {
    id: createLevelId(9),
    title: '9: Multiple Targets',
    description: 'Center multiple elements as a group using flexbox.',
    initialHTML:
      '<div class="container">\n  <div class="target">🎪</div>\n  <div class="target">🎭</div>\n  <div class="target">🎨</div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  width: 40px;
  height: 40px;
  background: #8e44ad;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
  margin: 5px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can only modify the .container selector.',
    hint: 'Multiple targets need organization! Think about direction and how to arrange them while keeping them centered as a group 🎪',
    solutionCSS: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}`,
    explanation:
      'Flexbox shines with multiple elements! "flex-direction: column" stacks items vertically, while "justify-content: center" and "align-items: center" center the entire group as one unit. The individual margins (5px) create nice spacing between items. It\'s like centering a perfectly organized stack!',
    difficulty: 'advanced',
    tags: ['flexbox', 'multiple-elements', 'flex-direction', 'stacking'],
  },
  {
    id: createLevelId(10),
    title: '10: CSS Ninja Final Boss',
    description:
      'Master-level centering with grid, responsive sizing, and modern CSS!',
    initialHTML:
      '<div class="container">\n  <div class="target">\n    <div class="inner">🥷</div>\n    <div class="text">CSS NINJA</div>\n  </div>\n</div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
}

.target {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  text-align: center;
}

.inner {
  font-size: 32px;
  margin-bottom: 8px;
}

.text {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}`,
    editableSelectors: {
      '.container': {
        lockedProperties: ['width', 'height', 'border', 'background'],
        allowedProperties: ['*'],
        initialEditableCSS:
          '  /* i just want my child to be happy and centered */',
      },
      '.target': {
        lockedProperties: [
          'background',
          'border-radius',
          'padding',
          'color',
          'text-align',
        ],
        allowedProperties: ['*'],
        initialEditableCSS: '  /* come on. just center me. */',
      },
    },
    requirements: {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    },
    constraints: 'You can modify both .container and .target selectors.',
    hint: 'Final boss mode! Combine the power of grids with responsive sizing that clamps between boundaries. Add some shadow magic for style 🥷',
    solutionCSS: `.container {
  display: grid;
  place-items: center;
}

.target {
  width: clamp(120px, 60%, 200px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}`,
    explanation:
      'Welcome to CSS ninja status! This combines grid centering with modern responsive design. "clamp(120px, 60%, 200px)" creates a responsive width: minimum 120px, preferred 60% of container, maximum 200px. Add a gradient background, box-shadow, and perfect typography - you\'ve mastered both centering AND style! 🥷',
    difficulty: 'expert',
    tags: ['grid', 'clamp', 'responsive', 'modern', 'advanced-styling'],
  },
];

/**
 * Secret level requiring the use of !important to override stubborn styles
 * This level demonstrates CSS specificity and the nuclear option of !important
 */
export const SECRET_IMPORTANT_LEVEL: Level = {
  id: createLevelId(999),
  title: 'Secret: !important Override Master',
  description:
    'Some styles are too stubborn to override normally. Sometimes you need the nuclear option to force your centering through!',
  initialHTML:
    '<div class="container">\n  <div class="target" style="margin-left: 100px; margin-top: 100px;">🔥💀</div>\n</div>',
  lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
  position: relative;
}

/* These ultra-specific styles are fighting your centering attempts! */
div.container div.target {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  border-radius: 12px;
  font-size: 32px;
  text-align: center;
  line-height: 80px;
  position: absolute;
  margin: 0;
}`,
  editableSelectors: {
    '.target': {
      lockedProperties: [
        'width',
        'height',
        'background',
        'border-radius',
        'font-size',
        'text-align',
        'line-height',
      ],
      allowedProperties: ['*'], // Allow all properties for the secret level
      initialEditableCSS: '  /* come on. just center me. */',
    },
  },
  requirements: {
    requiresHorizontalCentering: true,
    requiresVerticalCentering: true,
  },
  constraints: 'You can only modify the .target selector.',
  hint: 'Sometimes normal CSS rules get overruled by more specific selectors and inline styles. You might need to emphasize your declarations with extra authority! 💥',
  solutionCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
  background: #f0f0f0;
  position: relative;
}

/* These ultra-specific styles are fighting your centering attempts! */
div.container div.target {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  border-radius: 12px;
  font-size: 32px;
  text-align: center;
  line-height: 80px;
  position: absolute;
  margin: 0;
}

.target {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
}`,
  explanation:
    'Welcome to the dark side of CSS! When inline styles (specificity 1000) and highly specific selectors fight your centering, normal CSS declarations lose the specificity war. The !important declaration gives your properties maximum weight, overriding even inline styles. Use sparingly - with great power comes great responsibility! ⚡',
  difficulty: 'expert',
  tags: [
    'important',
    'specificity',
    'override',
    'nuclear-option',
    'inline-styles',
  ],
};
