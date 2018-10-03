/**
 * IndexedDB插件 封装了连接数据库、增删改查等操作
 * written in 2018/09/29
 *
 * @name IDB-api.js
 * @author Sam Xu
 * @version v0.1.0
 */

/* eslint-disable */
const defOption = {
    dbName: 'dms_mobile_mart',
    version: 1,
    errHandler: function (err) {
        console.log('打开数据库失败', err)
    },
    upgradeHandler: function (e) {
        console.log('数据库升级成功', e)
        let db = e.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
            let objectStore = db.createObjectStore(this.storeName, {
                keyPath: 'id',
                autoIncrement: true
            })
            objectStore.createIndex('usertokenIndex', 'usertoken', { unique: true })
            objectStore.createIndex('nonstandardIndex', 'nonstandard', { unique: false })
            objectStore.createIndex('partsIndex', 'parts', { unique: false })
        }
    }
}

const IDB = (options) => {
    this.dbName = options.dbName || defOption.dbName
    this.version = options.version || defOption.version
    this.storeName = options.storeName || defOption.storeName
    this.errHandler = options.errHandler || defOption.errHandler
    this.upgradeHandler = options.upgradeHandler || defOption.upgradeHandler
    this.dbInstance = {}
}

IDB.prototype = {
    /**
     * 连接数据库
     * @returns {Function} cb 回调
     */
    open: (cb) => {
        let request = window.indexedDB.open(this.dbName, this.version)
        request.onerror = this.errHandler
        request.onupgradeneeded = this.upgradeHandler.bind(this)
        request.onsuccess = (e) => {
            // console.log('打开数据库成功', e)
            this.dbInstance = request.result
            if (cb && typeof cb === 'function') cb()
        }
    },
    // 获取表对象
    getObjectStore: (mode) => {
        mode = mode || 'readonly'
        let txn = this.dbInstance.transaction([this.storeName], mode)
        let store = txn.objectStore(this.storeName)
        return store
    },
    // 增、改
    save: (data, cb) => {
        IDB.prototype.open(function () {
            let store, request, mode
            mode = 'readwrite'
            store = IDB.prototype.getObjectStore(mode)
            request = data.id ? store.put(data) : store.add(data)
            if (cb && typeof cb === 'function') {
                request.onsuccess = cb
                request.onerror = cb
            }
        })
    },
    // 查表
    get: (method, cb) => {
        IDB.prototype.open(function () {
            let request, _method
            let store = IDB.prototype.getObjectStore()
            if (method.id) {
                _method = parseInt(method.id)
                request = store.get(_method)
            } else {
                Object.keys(method).forEach((item) => {
                    _method = method[item]
                    request = store.index(item).get(_method)
                })
            }
            request.onsuccess = function (e) {
                if (cb && typeof cb === 'function') cb(e.target.result)
            }
        })
    },
    // 删
    delete: (id, cb) => {
        IDB.prototype.open(function () {
            let mode = 'readwrite'
            let store = IDB.prototype.getObjectStore(mode)
            let request = store.delete(id)
            if (cb && typeof cb === 'function') request.onsuccess = cb
        })
    },
    // 清空表
    clear: (cb) => {
        IDB.prototype.open(function () {
            let mode = 'readwrite'
            let store = IDB.prototype.getObjectStore(mode)
            let request = store.clear()
            if (cb && typeof cb === 'function') request.onsuccess = cb
        })
    }
}

export default IDB
