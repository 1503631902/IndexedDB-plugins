/**
 * IndexedDB插件 封装了连接数据库、增删改查等操作
 * written in 2018/09/29
 *
 * @name IDB-api.js
 * @author Sam Xu
 * @version v0.1.0
 */

/* eslint-disable */
const defOptions = {
    dbName: '',
    version: 1
}

const IDB = function (options) {
    this.dbName = options.dbName || defOptions.dbName
    this.version = options.version || defOptions.version
    this.storeList = options.storeList || []
    this.dbInstance = {}
    this.setStoreName = (name) => {
        this.storeName = name
    }
}

IDB.prototype = {
    /**
     * 连接数据库
     * @returns {Function} cb 回调
     */
    open: function (cb) {
        let request = window.indexedDB.open(this.dbName, this.version)
        request.onerror = (err) => {
            console.log('打开数据库失败', err)
        }
        request.onupgradeneeded = (e) => {
            console.log('数据库升级成功', e)
            let db = e.target.result
            if (this.storeList && this.storeList.length > 0) {
                this.storeList.forEach((item) => {
                    if (!db.objectStoreNames.contains(item)) {
                        let objectStore = db.createObjectStore(item, {
                            keyPath: 'id',
                            autoIncrement: true
                        })
                        objectStore.createIndex('usertokenIndex', 'usertoken', { unique: true })
                    }
                })
            }
        }
        request.onsuccess = (e) => {
            console.log('打开数据库成功', e)
            this.dbInstance = request.result
            if (cb && typeof cb === 'function') cb()
        }
    },
    // 获取表对象
    getObjectStore: function (mode) {
        mode = mode || 'readonly'
        let txn = this.dbInstance.transaction([this.storeName], mode)
        let store = txn.objectStore(this.storeName)
        return store
    },
    // 增、改
    save: function (data, cb) {
        let store, request, mode
        mode = 'readwrite'
        store = this.getObjectStore(mode)
        request = data.id ? store.put(data) : store.add(data)
        if (cb && typeof cb === 'function') {
            request.onsuccess = cb
            request.onerror = cb
        }
    },
    // 查表
    get: function (method, cb) {
        let request, _method
        let store = this.getObjectStore()
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
    },
    // 删
    delete: function (id, cb) {
        let mode = 'readwrite'
        let store = this.getObjectStore(mode)
        let request = store.delete(id)
        if (cb && typeof cb === 'function') request.onsuccess = cb
    },
    // 清空表
    clear: function (cb) {
        let mode = 'readwrite'
        let store = this.getObjectStore(mode)
        let request = store.clear()
        if (cb && typeof cb === 'function') request.onsuccess = cb
    }
}

export default IDB
