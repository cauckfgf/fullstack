"use static";

!function () {

    initVue();
    
}();

ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
function initVue() {

    _app = new Vue({
        el:"#app",
        components:{

        },
        template:`<Card>
                        <div style="text-align:center">
                            <Icon size=30 type="heart"></Icon>
                            <h3>本网站作为微信后端调用淘宝联盟api 使用</h3>
                        </div>
                    </Card>`,
        created(){

        },
        data(){
            return {
                isCollapsed: false
            }
        },
        methods:{
           
        },
        computed: {

        },
        mounted(){

            
        }
    });
    
}


