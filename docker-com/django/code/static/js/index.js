"use static";

!function () {

    initVue();
    
}();
// <figure id="multiSlide" class="multiSlide">
//                         <div v-for="item in this.registeredBoxes" class="box" :style="item.style" :data-pos="item.datapos">
//                             <img :src="item.img"></img>
//                         </div>
//                         <div>
//                             <Button size="large" type="primary" @click="move('top')" shape="circle" icon="arrow-up-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('bottom')" shape="circle" icon="arrow-down-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('right')" shape="circle" icon="arrow-right-a" style="margin:5px"></Button>
//                             <Button size="large" type="primary" @click="move('left')" shape="circle" icon="arrow-left-a" style="margin:5px"></Button>
//                         </div>
//                     </figure>
function initVue() {
    _app = new Vue({
        el:"#app",
        components:{
            vueimage: vueImages.default
        },
        template:`
            <Row>
                <i-col :md="24" :sm="24" style="">
                    
                    <vueimage :imgs="images"></vueimage>
                </i-col>
            </Row>`,
        created(){
            var self=this;
            $.ajax("/first/rest/file/").done(res=>{
                var len = parseInt(res.results.length/2);
                for(var i in res.results){
                    if(i<len){
                        self.Box(i-len+5,2,res.results[i].file)
                    }else{
                        self.Box(2,len-i+5,res.results[i].file)
                    }
                    self.images.push({
                        imageUrl:res.results[i].file,
                        caption: `<a href="#">Photo by ${i}</a>`
                    });
                    
                }
            })
            // this.Box(-2,2,'/static/image/2689.jpg');
            // this.Box(-1,2,'/static/image/2690.jpg');
            // this.Box(0,2,'/static/image/2691.jpg');
            // this.Box(1,2,'/static/image/2692.jpg');
            // this.Box(2,2,'/static/image/2693.jpg');
            // this.Box(3,2,'/static/image/2694.jpg');
            // this.Box(4,2,'/static/image/2695.jpg');
            // this.Box(5,2,'/static/image/2696.jpg');
            // this.Box(2,-2,'/static/image/2697.jpg');
            // this.Box(2,-1,'/static/image/2698.jpg');
            // this.Box(2,0,'/static/image/2699.jpg');
            // this.Box(2,1,'/static/image/2700.jpg');
            // this.Box(2,2,'/static/image/2701.jpg');
            // this.Box(2,3,'/static/image/2702.jpg');
            // this.Box(2,4,'/static/image/2703.jpg');
            // this.Box(2,5,'/static/image/2704.jpg');
        },
        data(){
            return {
                slidePosY:0,
                slidePosX:0,
                registeredBoxes:[],
                unit:300,
                images:[]
            }
        },
        methods:{
            move(dir){
                if(dir=='top'&&this.slidePosY>-3){
                    this.slide('Y',-1);
                }else if(dir=='bottom'&&this.slidePosY<4){
                    this.slide('Y',1);
                }else if(dir=='left'&&this.slidePosX>-3){
                    this.slide('X',-1);
                }else if(dir=='right'&&this.slidePosY<4){
                    this.slide('X',1);
                }
            },
            Box(posX,posY,img){
                var item = {style:{},pos:{X:posX,Y:posY}}
                item.style.left = (posX*this.unit)-this.unit+'px';
                item.style.top = (posY*this.unit)-this.unit+'px';
                item.datapos = posX.toString()+posY.toString()
                item.img = img
                this.registeredBoxes.push(item);
            },
            setPosition(item,axis,val){
                item.pos[axis] = val;
                if(axis == 'X'){
                    item.style.left  = (item.pos[axis]*this.unit)-this.unit+'px';
                }else if(axis == 'Y'){
                    item.style.top   = (item.pos[axis]*this.unit)-this.unit+'px';
                }
                item.datapos= item.pos.X.toString()+item.pos.Y.toString()
            },
            slide(axis,dir){
                var len = this.registeredBoxes.length;
                
                if(axis == 'Y'){
                    for(var i=0; i<len; i++){
                        if(this.registeredBoxes[i].pos['X']=='2'){
                            this.setPosition(this.registeredBoxes[i],axis,this.registeredBoxes[i].pos['Y']+(1*dir))
                            // this.registeredBoxes[i].setPosition(axis,this.registeredBoxes[i].pos['Y']+(1*dir));
                        }
                    }
                    this.slidePosY = this.slidePosY+dir;
                }else if(axis == 'X'){
                    for(var i=0; i<len; i++){
                        if(this.registeredBoxes[i].pos['Y']=='2'){
                            this.setPosition(this.registeredBoxes[i],axis,this.registeredBoxes[i].pos['X']+(1*dir));
                            // this.registeredBoxes[i].setPosition(axis,this.registeredBoxes[i].pos['X']+(1*dir));
                        }
                    }
                    this.slidePosX = this.slidePosX+dir;
                }
            }
        },
        mounted(){
            // Vue.nextTick(()=>{
            //     for(var i in $(".ttips")){
            //         AddMarkerPingMian('red',$(".ttips")[i])
            //     }
            // })
            
        }
    });
    
}


