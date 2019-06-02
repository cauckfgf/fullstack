transactions={
    template:`<div>
        <div v-for="item,index in ts">
            交易：{{index}}<br/>
            sender:{{item.sender}}<br/>
            recipient:{{item.recipient}}<br/>
            amount:{{item.amount}}<br/><br/>

        </div>
        <div style="display:none;">{{tmp}}</div>
    </div>`,
    props:[
        'blockid',
    ],

    data(){
        return {
            ts:[]
        }
    },
    computed: {
            tmp: function(){
                var self=this;
                $.ajax(`/blockchain/rest/transactions/?Block__id=${this.blockid}`).done(res=>{
                    self.ts=res.results;
                })
                return this.blockid;
            },
        },
    created(){
        var self=this;
        $.ajax(`/blockchain/rest/transactions/?Block__id=${this.blockid}`).done(res=>{
            self.ts=res.results;
        })
        return [];
    }

}