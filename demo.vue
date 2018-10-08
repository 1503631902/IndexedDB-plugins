<style lang="less">
.dms-search{}
</style>

<template>
    <div class="dms-search">
    </div>
</template>

<script>
import IDB from './IDB-api'
export default {
    name: 'dmsSearch',
    beforeRouteEnter (to, from, next) {
        next()
    },
    mixins: [],
    components: {},
    data () {
        return {}
    },
    props: {},
    methods: {},
    computed: {},
    mounted () {
        let db = new IDB({
            dbName: 'dms_mobile_mart', // 数据库名
            version: 1,
            storeList: ['search_nonstandard_history', 'search_parts_history'] // 注册的store名
        })
        db.open() // 连接数据库
        
        let data = {
            id: 1,
            usertoken: '06376afe-22d5-43bc-b8c6-4df0ef106818',
            nonstandard: ['非1', '标', '历史', '搜索'],
            parts: ['配', '件', '历史', '搜索']
        }
        let data1 = {
            id: 2,
            usertoken: '0519-22d5-43bc-b8c6-4df0ef10424',
            nonstandard: ['标', '准', '历史', '搜索'],
            parts: ['备', '件', '包', '历史', '搜索']
        }
        db.save(data, (e) => {
            console.log('数据1写入成功', e)
        })
        db.save(data1, (e) => {
            console.log('数据2写入成功', e)
        })
        setTimeout(() => {
            db.get({usertokenIndex: '06376afe-22d5-43bc-b8c6-4df0ef106818'}, (res) => {
                console.log('数据读取成功', res)
            })
        }, 1000)
        // setTimeout(() => {
        //     db.delete(2, (e) => {
        //         console.log('数据删除成功', e)
        //     })
        // }, 2000)
        // setTimeout(() => {
        //     db.clear((e) => {
        //         console.log('数据清空成功', e)
        //     })
        // }, 2000)
    },
    beforeRouteUpdate (to, from, next) {
        next()
    }
}
</script>
