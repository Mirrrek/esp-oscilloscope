import { screen, BrowserWindow } from 'electron';
import Store from 'electron-store';

export default function createWindow(windowName: string) {
    const store = new Store({ name: 'window-pos' });

    const primaryDisplayBounds = screen.getPrimaryDisplay().bounds;
    const defaultPos = {
        width: Math.floor(primaryDisplayBounds.width * 0.6),
        height: Math.floor(primaryDisplayBounds.height * 0.6),
        x: Math.floor(primaryDisplayBounds.width * 0.2),
        y: Math.floor(primaryDisplayBounds.height * 0.2),
    };

    let pos = store.get(windowName, defaultPos) as { width: number, height: number, x: number, y: number };

    if (!screen.getAllDisplays().some(display => (
        pos.x >= display.bounds.x &&
        pos.y >= display.bounds.y &&
        pos.x + pos.width <= display.bounds.x + display.bounds.width &&
        pos.y + pos.height <= display.bounds.y + display.bounds.height
    ))) {
        pos = defaultPos;
    }

    const win = new BrowserWindow({
        ...pos,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.on('close', () => {
        if (!win.isMinimized() && !win.isMaximized()) {
            const position = win.getPosition();
            const size = win.getSize();
            pos = { x: position[0], y: position[1], width: size[0], height: size[1] };
        }
        store.set(windowName, pos);
    });

    return win;
}
