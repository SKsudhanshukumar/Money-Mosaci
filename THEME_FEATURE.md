# Dark/Light Mode Theme Feature

## Overview
The finance application now supports both dark and light mode themes with a toggle button in the navigation bar.

## Features Added

### 1. Theme Context (`src/contexts/ThemeContext.tsx`)
- Manages theme state (light/dark mode)
- Persists theme preference in localStorage
- Provides `useThemeMode` hook for components

### 2. Enhanced Theme Configuration (`src/theme.ts`)
- Added `lightTokens` for light mode color palette
- Updated `themeSettings` to be a function that accepts mode parameter
- Automatic color adaptation for both themes

### 3. Theme Toggle Button (Navbar)
- Sun/Moon icon toggle button in the navigation bar
- Tooltip showing current mode and switch action
- Smooth theme transitions

### 4. Component Updates
- **DashboardBox**: Adaptive shadows and borders for both themes
- **Charts**: Grid lines and colors adapt to theme mode
- **DataGrid**: Border colors and text colors adapt to theme mode

## Usage

### For Users
1. Click the sun/moon icon in the navigation bar to toggle between themes
2. Theme preference is automatically saved and restored on page reload
3. Default theme is dark mode

### For Developers
```tsx
import { useThemeMode } from '../contexts/ThemeContext';

function MyComponent() {
  const { mode, toggleTheme } = useThemeMode();
  
  return (
    <div>
      <p>Current theme: {mode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## Theme Colors

### Dark Mode (Default)
- Background: Dark grays (#1f2026, #2d2d34)
- Text: Light grays (#e1e2e7, #d1d3da)
- Primary: Light green (#12efc8)
- Charts: Dark grid lines

### Light Mode
- Background: Light colors (#ffffff, #f5f5f5)
- Text: Dark grays (#242427, #6b6d74)
- Primary: Darker green (#12efc8)
- Charts: Light grid lines

## Files Modified
- `src/contexts/ThemeContext.tsx` (new)
- `src/theme.ts` (enhanced)
- `src/App.tsx` (theme provider integration)
- `src/scenes/navbar/index.tsx` (toggle button)
- `src/components/DashboardBox.tsx` (theme-aware styling)
- `src/scenes/dashboard/Row1.tsx` (chart colors)
- `src/scenes/dashboard/Row2.tsx` (chart colors)
- `src/scenes/dashboard/Row3.tsx` (DataGrid styling)
- `src/scenes/predictions/index.tsx` (chart colors)

## Technical Details
- Uses React Context API for state management
- localStorage for persistence
- Material-UI theme system integration
- TypeScript support with proper typing
- Automatic color adaptation for all chart components