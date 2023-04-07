import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

async function main() {
    if (isProd) {
        serve({ directory: 'app' });
    } else {
        app.setPath('userData', `${app.getPath('userData')} (development)`);
    }

    await app.whenReady();

    const mainWindow = createWindow('main');

    if (isProd) {
        await mainWindow.loadURL('app://./home.html');
    } else {
        await mainWindow.loadURL(`http://localhost:${process.argv[2]}/home`);
    }

    app.on('window-all-closed', () => {
        app.quit();
    });
}

main();
