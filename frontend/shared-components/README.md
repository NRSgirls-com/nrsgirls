# Shared Components - NRSgirls Platform

## Overview
Reusable UI components and utilities shared across all frontend applications (Homepage, DJ Portal, Performer Portal).

## Purpose
- Maintain consistent design language
- Reduce code duplication
- Improve maintainability
- Speed up development
- Ensure accessibility standards

## Component Library

### 1. Layout Components

#### `Layout.jsx`
Main application layout wrapper
- Header integration
- Footer integration
- Main content area
- Responsive grid system

#### `Container.jsx`
Content container with max-width
- Responsive padding
- Centered alignment
- Breakpoint variants

#### `Grid.jsx`
Flexible grid system
- Responsive columns
- Gap controls
- Auto-fit and auto-fill modes

#### `Flex.jsx`
Flexbox utility component
- Direction control
- Alignment options
- Gap controls
- Wrap settings

### 2. Navigation Components

#### `Navbar.jsx`
Main navigation bar
- Logo placement
- Navigation links
- User menu
- Mobile hamburger menu
- Responsive behavior

#### `Sidebar.jsx`
Side navigation panel
- Collapsible design
- Icon + text navigation
- Active state indicators
- Nested menu support

#### `Breadcrumbs.jsx`
Navigation breadcrumbs
- Auto-generated from route
- Custom labels
- Clickable navigation

#### `Tabs.jsx`
Tabbed navigation interface
- Multiple variants
- Active state
- Keyboard navigation
- Content panels

### 3. Form Components

#### `Input.jsx`
Text input field
- Label integration
- Error states
- Helper text
- Icon support
- Validation states

#### `TextArea.jsx`
Multi-line text input
- Auto-resize option
- Character counter
- Error states

#### `Select.jsx`
Dropdown select
- Search capability
- Multi-select option
- Custom styling
- Grouped options

#### `Checkbox.jsx`
Checkbox input
- Label positioning
- Indeterminate state
- Custom styling

#### `Radio.jsx`
Radio button input
- Group management
- Custom styling
- Label integration

#### `Switch.jsx`
Toggle switch
- On/off states
- Labels
- Disabled state
- Size variants

#### `DatePicker.jsx`
Date selection component
- Calendar view
- Range selection
- Min/max dates
- Custom formatting

#### `FileUpload.jsx`
File upload interface
- Drag-and-drop
- Multiple file support
- Progress indication
- File type validation
- Size limits

#### `Form.jsx`
Form wrapper with validation
- Schema validation
- Error handling
- Submit handling
- Reset functionality

### 4. Button Components

#### `Button.jsx`
Primary button component
- Multiple variants (primary, secondary, outline, ghost)
- Size options (small, medium, large)
- Icon support
- Loading state
- Disabled state

#### `IconButton.jsx`
Icon-only button
- Size variants
- Tooltip integration
- Accessibility labels

#### `ButtonGroup.jsx`
Button grouping component
- Horizontal and vertical
- Equal width option
- Segmented control style

### 5. Display Components

#### `Card.jsx`
Content card container
- Header, body, footer sections
- Hover effects
- Shadow variants
- Border options

#### `Badge.jsx`
Status badge
- Color variants
- Size options
- Dot indicator
- Removable option

#### `Tag.jsx`
Categorical tag
- Color options
- Removable option
- Click handling

#### `Avatar.jsx`
User avatar display
- Image support
- Fallback initials
- Size variants
- Status indicator
- Group avatars

#### `Tooltip.jsx`
Hover information tooltip
- Position options
- Delay settings
- Accessibility support

#### `Modal.jsx`
Modal dialog
- Multiple sizes
- Close button
- Backdrop click to close
- Focus trap
- Keyboard navigation (ESC to close)

#### `Drawer.jsx`
Side drawer panel
- Left/right position
- Overlay backdrop
- Smooth animation
- Close button

#### `Alert.jsx`
Alert/notification banner
- Variants (info, success, warning, error)
- Dismissible option
- Icon support
- Action buttons

#### `Toast.jsx`
Toast notification
- Auto-dismiss
- Position options
- Stack management
- Action buttons

#### `Spinner.jsx`
Loading spinner
- Size variants
- Color options
- Centered option
- Text label

#### `Skeleton.jsx`
Content placeholder
- Multiple variants (text, circle, rectangle)
- Animation
- Responsive

#### `Progress.jsx`
Progress indicator
- Linear and circular variants
- Percentage display
- Color options
- Animated

#### `Divider.jsx`
Visual divider
- Horizontal and vertical
- Text label option
- Thickness variants

### 6. Media Components

#### `Image.jsx`
Optimized image component
- Lazy loading
- Placeholder
- Error fallback
- Responsive sizing

#### `Video.jsx`
Video player component
- Controls
- Poster image
- Auto-play option
- Fullscreen support

#### `AudioPlayer.jsx`
Audio playback component
- Play/pause controls
- Seek bar
- Volume control
- Time display

### 7. Data Display Components

#### `Table.jsx`
Data table
- Sortable columns
- Pagination
- Row selection
- Expandable rows
- Responsive design

#### `List.jsx`
Generic list component
- Ordered and unordered
- Custom item rendering
- Dividers
- Avatar lists

#### `DataGrid.jsx`
Advanced data grid
- Sorting
- Filtering
- Pagination
- Cell rendering
- Export functionality

#### `Stat.jsx`
Statistic display
- Label and value
- Change indicator
- Icon support
- Size variants

#### `Timeline.jsx`
Event timeline
- Vertical layout
- Custom icons
- Alternating sides
- Timestamps

### 8. Feedback Components

#### `EmptyState.jsx`
Empty state display
- Icon
- Title and description
- Action button
- Custom illustration

#### `ErrorBoundary.jsx`
Error boundary wrapper
- Error catching
- Fallback UI
- Error reporting
- Reset functionality

#### `LoadingOverlay.jsx`
Full-page loading overlay
- Spinner
- Custom message
- Blur backdrop

### 9. Utility Components

#### `Portal.jsx`
React portal wrapper
- Render outside DOM hierarchy
- Custom target container

#### `VisuallyHidden.jsx`
Visually hidden content (for screen readers)
- Accessibility support

#### `FocusTrap.jsx`
Focus management utility
- Trap focus within component
- Keyboard navigation

### 10. Chart Components

#### `LineChart.jsx`
Line chart visualization
- Responsive
- Tooltip
- Legend
- Multiple series

#### `BarChart.jsx`
Bar chart visualization
- Horizontal and vertical
- Stacked option
- Tooltip

#### `PieChart.jsx`
Pie/Donut chart
- Custom colors
- Legend
- Tooltip

#### `AreaChart.jsx`
Area chart visualization
- Stacked option
- Gradient fill
- Tooltip

## Hooks

### Custom Hooks Library

#### `useAuth.js`
Authentication state management
- Login/logout
- User data
- Token refresh
- Permission checks

#### `useApi.js`
API request wrapper
- Loading states
- Error handling
- Automatic retries
- Request cancellation

#### `useForm.js`
Form state management
- Field values
- Validation
- Submit handling
- Error management

#### `useModal.js`
Modal state management
- Open/close
- Data passing
- Multiple modals

#### `useToast.js`
Toast notification management
- Show toast
- Queue management
- Auto-dismiss

#### `useMediaQuery.js`
Responsive breakpoint detection
- Screen size detection
- Breakpoint matching

#### `useLocalStorage.js`
Local storage wrapper
- Get/set values
- Type safety
- Serialization

#### `useDebounce.js`
Value debouncing
- Configurable delay
- Cancel handling

#### `useThrottle.js`
Value throttling
- Rate limiting
- Leading/trailing options

#### `useClickOutside.js`
Click outside detection
- Ref-based detection
- Callback execution

#### `useIntersectionObserver.js`
Intersection observer wrapper
- Lazy loading
- Infinite scroll
- Visibility tracking

#### `useCopyToClipboard.js`
Copy to clipboard
- Success/error handling
- Fallback support

#### `useWebSocket.js`
WebSocket connection management
- Auto-reconnect
- Message handling
- Connection status

## Utilities

### Helper Functions

#### `formatters.js`
- `formatCurrency()` - Currency formatting
- `formatDate()` - Date formatting
- `formatDuration()` - Time duration formatting
- `formatNumber()` - Number formatting with commas
- `formatFileSize()` - File size formatting (KB, MB, GB)

#### `validators.js`
- `validateEmail()` - Email validation
- `validatePassword()` - Password strength
- `validateURL()` - URL validation
- `validatePhone()` - Phone number validation
- `validateUsername()` - Username validation

#### `api.js`
- API client configuration
- Request interceptors
- Response interceptors
- Error handling

#### `storage.js`
- Local storage wrapper
- Session storage wrapper
- Cookie management
- Storage events

#### `constants.js`
- Color palette
- Breakpoints
- API endpoints
- Configuration values

#### `string.js`
- `truncate()` - String truncation
- `slugify()` - URL slug generation
- `capitalize()` - String capitalization
- `camelCase()` - camelCase conversion
- `kebabCase()` - kebab-case conversion

#### `array.js`
- `chunk()` - Array chunking
- `unique()` - Remove duplicates
- `groupBy()` - Group array by key
- `sortBy()` - Sort array by key

#### `date.js`
- `isToday()` - Check if date is today
- `isPast()` - Check if date is in past
- `addDays()` - Add days to date
- `diffDays()` - Difference between dates

## Styling

### Theme Configuration
```javascript
theme = {
  colors: {
    primary: '#FF006E',
    secondary: '#8338EC',
    success: '#06FFA5',
    warning: '#FFB703',
    error: '#FB5607',
    // ... more colors
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    // ... more spacing
  },
  typography: {
    // Font families, sizes, weights
  },
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    // ... more breakpoints
  }
}
```

### CSS Variables
- Custom properties for theming
- Dark mode support
- High contrast mode

## File Structure
```
shared-components/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── forms/
│   ├── buttons/
│   ├── display/
│   ├── media/
│   ├── data/
│   ├── feedback/
│   ├── utility/
│   └── charts/
├── hooks/
├── utils/
├── styles/
│   ├── theme.js
│   ├── global.css
│   └── variables.css
├── constants/
├── types/
└── README.md
```

## Usage Examples

### Using a Button
```jsx
import { Button } from '@/shared-components/buttons';

<Button variant="primary" size="large" onClick={handleClick}>
  Click Me
</Button>
```

### Using a Form
```jsx
import { Form, Input, Button } from '@/shared-components';

<Form onSubmit={handleSubmit}>
  <Input name="email" label="Email" type="email" required />
  <Input name="password" label="Password" type="password" required />
  <Button type="submit">Login</Button>
</Form>
```

### Using a Modal
```jsx
import { Modal, useModal } from '@/shared-components';

const { isOpen, open, close } = useModal();

<Button onClick={open}>Open Modal</Button>
<Modal isOpen={isOpen} onClose={close} title="Modal Title">
  Modal content here
</Modal>
```

## Testing
- Unit tests for all components
- Storybook for component documentation
- Visual regression testing
- Accessibility testing

## Documentation
- Component API documentation
- Usage examples
- Best practices
- Accessibility guidelines

## Contributing
- Component design guidelines
- Code style requirements
- Pull request process
- Testing requirements
