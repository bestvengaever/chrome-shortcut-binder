# Shortcut Binder Chrome Extension

A Chrome extension that allows you to create custom keyboard shortcuts to execute JavaScript commands on any webpage.

## Features

- Create custom keyboard shortcuts (e.g., Ctrl+Shift+E)
- Execute JavaScript commands on any webpage
- Real-time updates without page refresh
- Simple and intuitive popup interface
- Support for modifier keys (Ctrl, Shift, Alt)

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## Usage

1. Click the extension icon to open the popup
2. Add a new bind by clicking "Add New Bind"
3. Click in the shortcut field and press your desired key combination
4. Enter the JavaScript command you want to execute
5. Click "Test" to verify the command works
6. Use your shortcut on any webpage to execute the command

## Example Commands

- `SugarCube.State.variables.player.energy = 100` - Set player energy to 100 (for Twine games)
- `document.body.style.backgroundColor = 'red'` - Change page background to red
- `alert('Hello World!')` - Show an alert

## File Structure

- `manifest.json` - Extension configuration
- `popup.html` - Popup interface
- `popup.js` - Popup functionality
- `background.js` - Background service worker
- `content.js` - Content script for webpage interaction

## Permissions

- `storage` - Save and load bind configurations
- `commands` - Handle keyboard shortcuts
- `scripting` - Execute scripts in tabs
- `host_permissions` - Access all websites