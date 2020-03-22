<script>
    export default {
        mounted() {
           window.addEventListener('mousewheel',this.handleScroll,false)
        },

        methods: {
            handleScroll(e) {
                if (this.scrollBottom === 0 && this.scrollFlag) {
                    this.scrollFlag = false
                    this.$api.blogs.loadMore({
                        userName: '1',
                        pageIndex: this.pageIndex
                    }).then(res => {
                        if (!res.data.data.isEmpty) {
                            this._result(res, 'push')
                            setTimeout(() => {
                                this.scrollFlag = true
                                this.scrollBottom = 100
                                this.scrollFlagtext = ''
                            },2000)
                        }  else {
                            this.scrollFlagtext = '已经到底!'
                        }
                    })
                } else {  
                    this.scrollFlag = false
                }
            },

            getScroll(event) {
            // 滚动条距离底部的距离scrollBottom
            let scrollBottom = event.target.scrollHeight -  event.target.scrollTop - event.target.clientHeight;
            if (scrollBottom === 0) this.scrollFlag = true
            this.scrollBottom = scrollBottom
            },
        }
    }
</script>
