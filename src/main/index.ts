import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { getNodeProcesses } from './process'
import { getPortsForPid, getUptimeForPid, killProcess } from './process/detail'

let tray: Tray | null = null

function createTray(mainWindow: BrowserWindow): void {
  const iconPath = is.dev
    ? join(__dirname, '../../resources/iconTemplate.png')
    : join(process.resourcesPath, 'iconTemplate.png')

  const icon = nativeImage.createFromPath(iconPath)
  tray = new Tray(icon)
  tray.setToolTip('NodeMoniter')

  const menu = Menu.buildFromTemplate([
    {
      label: '열기',
      click: () => {
        mainWindow.show()
        app.dock.show()
      }
    },
    { type: 'separator' },
    {
      label: '종료',
      click: () => app.quit()
    }
  ])

  tray.setContextMenu(menu)
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
      app.dock.hide()
    } else {
      mainWindow.show()
      app.dock.show()
    }
  })
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 닫기 버튼 → 종료 대신 숨김 (트레이 상주)
  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault()
      mainWindow.hide()
      app.dock.hide()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  createTray(mainWindow)
}

// app.isQuitting 타입 확장
declare module 'electron' {
  interface App {
    isQuitting: boolean
  }
}

app.isQuitting = false

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.nodemoniter')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('get-node-processes', () => getNodeProcesses())

  ipcMain.handle('get-process-detail', (_e, pid: number) => ({
    ports: getPortsForPid(pid),
    uptimeSeconds: getUptimeForPid(pid)
  }))

  ipcMain.handle('kill-process', (_e, pid: number, state: string) => {
    try {
      killProcess(pid, state as 'running' | 'sleeping' | 'zombie')
      return { success: true }
    } catch (e) {
      return { success: false, error: String(e) }
    }
  })

  createWindow()

  app.on('activate', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      win.show()
      app.dock.show()
    } else {
      createWindow()
    }
  })
})

app.on('before-quit', () => {
  app.isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
