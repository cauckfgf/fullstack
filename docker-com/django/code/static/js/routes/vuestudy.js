var v_model_var
function v_model_method(){
    v_model_var = {};
    Object.defineProperty(v_model_var,'hello',{
         set: function(newVal){
              document.getElementById('a').value = newVal;
              document.getElementById('b').innerHTML = newVal;
         },
         get: function(){
              return document.getElementById('b').innerHTML;
         }
    });

    document.addEventListener('keyup',function(e){
         v_model_var.hello = e.target.value;
    });
}
v_model={
    template:`<div>
        <input type="text" id="a"/>
        <span id="b"></span>
        <br/>
        <br/>
        <div>源码:</div>
        <p style="white-space: pre;border: solid 1px #49506078;">
            {{source}}
        </p>
    </div>`,
    props:[
        'blockid',
    ],

    data(){
        return {
            ts:[],
            source:`<input type="text" id="a"/>
            <span id="b"></span>
            <script>
                function v_model_method(){
                    v_model_var = {};
                    Object.defineProperty(v_model_var,'hello',{
                         set: function(newVal){
                              document.getElementById('a').value = newVal;
                              document.getElementById('b').innerHTML = newVal;
                         },
                         get: function(){
                              return document.getElementById('b').innerHTML;
                         }
                    });

                    document.addEventListener('keyup',function(e){
                         v_model_var.hello = e.target.value;
                    });
                }
            </script>`
        }
    },
    mounted(){
        v_model_method()
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