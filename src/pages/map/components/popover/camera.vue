<template>
  <div>
    <div class="popover" v-show="hideIN">
      <address>位置:{{popData.name}}</address>
      <span>类型:{{popData.webcamType}}</span> &nbsp;&nbsp; &nbsp;&nbsp;
      <!--<el-button type="text" >播放</el-button>-->
      <img class="picie" ref="picie" src="/static/images/vide.jpg" @click.stop="playVideo($event)">
    </div>
    <el-dialog title="播放视频" :visible.sync="centerDialogVisible" width="40%" :append-to-body="true" show-close :before-close="handleClose" @open="open" center>
      <div>{{this.popData.id}}</div>
      <div>是否可移动：{{ this.popData.isGD}}</div>
			<ul class='pie'>
		    <li class='slice-one slice' @mousedown="moveStart(7)" @mouseup="moveEnd(7)"> <span><i class="el-icon-arrow-up"></i></span> </li> 
		    <li class='slice-two slice' @mousedown="moveStart(4)" @mouseup="moveEnd(4)"> <span><i class="el-icon-arrow-up"></i></span></li>
		    <li class='slice-three slice' @mousedown="moveStart(8)" @mouseup="moveEnd(8)"> <span><i class="el-icon-arrow-up"></i></span> </li>
		    <li class='slice-four slice' @mousedown="moveStart(1)" @mouseup="moveEnd(1)"> <span><i class="el-icon-arrow-up"></i></span></li>
		  </ul>
      <object slot="footer" id="earthAX" ref="earthAX" classid="clsid:7D05673A-9C06-4435-A843-6286C4C5FBFD" style="width: 100%;height: 340px;"></object>
    </el-dialog>
  </div>
</template>
<script>
  import { MessageBox } from 'element-ui';
  // import VideoPlugin from '../videoPlugin'
  export default {
    name: 'popover-camera',
    components: {
      MessageBox
    },
    data() {
      return {
        centerDialogVisible: false,
        hideIN: true,
        dtPlayParam: {
          number: '54017503',
          recordIp: '15.128.49.110',
          port: 8000,
          userName: 'admin',
          password: '12345',
          channel: 6,
          CamInfo: '',
          isDH: false,
          isHik: true,
          isHD: false,
          wireless: false,
          isPvg: false,
          isFujie: false,
          isGD: false
        },
        earthAX: {},
      }
    },
    props: {
      popData: {
        Type: Object,
        default: () => {}
      }
    },
    computed: {
      src() {
        let src = 'http://15.128.20.122:10000/play.html?serial=31010401002000000001&code=' +
          this.popData.id + '&iframe=yes&aspect=640x360'
        return src
      }
    },
    methods: {
    	arrawsClick(event, dirction) {
    		alert(dirction)
    	},
      show(event) {
        console.log(event)
        // 阻止冒泡
        event.stopPropagation()
        // 阻止默认事件
        event.preventDefault()
      },
      open() {
        console.log('++++++++++++++', this.$refs, this.$el.innerHTML)
        this.InitAX()
      },
      goshow() {
        this.hideIN = false
      },
      handleClose(done) {
        try {
          this.closeCam()
        } catch(e) {

        }
        done()

      },
      InitAX() {
        var result = this.earthAX.InitAX()
        if(result !== 0) {
          alert('初始化失败')
        }
      },
      playCam() {

        let params = {
          number: this.popData.id,
          recordIp: this.popData.recordIp,
          port: this.popData.port,
          userName: this.popData.userName,
          password: this.popData.password,
          channel: Number(this.popData.channel),
          CamInfo: this.popData.camInfo,
          isDH: this.popData.isDH !== 'f' ? true : false,
          isHik: this.popData.isHik !== 'f' ? true : false,
          isHD: this.popData.isHD !== 'f' ? true : false,
          wireless: this.popData.wireless !== 'f' ? true : false,
          isPvg: this.popData.isPvg !== 'f' ? true : false,
          isFujie: this.popData.isFujie !== 'f' ? true : false,
          isGD: this.popData.isGD !== 'f' ? true : false
        }

        console.log('playVideo', this.popData, params)
        var result = this.earthAX.PlayVideo(JSON.stringify(params))
        if(result !== 0) {
          alert('播放失败')
        } else {
//        alert('播放成功')
        }
      },
      closeCam() {
        var result = this.earthAX.CloseVideo()
        if(result !== 0) {
          alert('停止失败')
        } else {
//        alert('停止成功')
        }
      },
      playVideo(event) {
	      console.log(event)
        this.centerDialogVisible = true
        this.dtPlayParam.number = this.popData.id
        console.log('playVideo', this.dtPlayParam)
        this.playCam()
      },
      closeVideo() {
        this.centerDialogVisible = false
        this.closeCam()
      },
      moveStart(dirction) {
      	let str = this.convertDirction(dirction)
      	let result = this.movePTZStart(str)
      	console.log("移动", dirction, result)
      },
      moveEnd(dirction) {
      	console.log("停止移动", dirction)
      	let str = this.convertDirction(dirction)
      	let result = this.movePTZEnd(str)
      	console.log("移动", dirction, result)
      },
      convertDirction(dirction) {
      	switch (dirction) {
      		case 1 : 
      			return "PTZLeft"
      		break;
      		case 2 : 
      			return "PTZLeftUp"
      		break;
      		case 3 : 
      			return "PTZLeftDown"
      		break;
      		case 4 : 
      			return "PTZRight"
      		break;
      		case 5 : 
      			return "PTZRightUp"
      		break;
      		case 6 : 
      			return "PTZRightDown"
      		break;
      		case 7 : 
      			return "PTZUp"
      		break;
      		case 8 : 
      			return "PTZDown"
      		break;
      		case 9 : 
      			return "PTZZoomIn"
      		break;
      		case 10 : 
      			return "PTZZoomOut"
      		break;
      		case 11 : 
      			return "PTZFocusNear"
      		break;
      		case 12 : 
      			return "PTZFocusFar"
      		break;
      		case 13 : 
      			return "PTZIrisOpen"
      		break;
      		case 14 : 
      			return "PTZIrisClose"
      		break;
      	}
      },
      movePTZStart(dirction) {
      	return this.earthAX.startPTZ(dirction)
      },
      movePTZEnd(dirction) {
      	return this.earthAX.endPTZ(dirction)
      }
    },
    mounted() {
      this.earthAX = this.$refs.earthAX
    }
  }
</script>
<style lang="less" scoped>
  .popover { 
  	& address { font-size: 14px; } 
  	& p { font-size: 14px; } 
  	& .el-tag { margin-left: 10px; } 
  	& .el-button--mini.is-circle { padding: 0; margin-left: 30px; } 
  	} 
  	.videoDiolog { 
  		/*position: fixed;*/ 
  		/*min-width: 600px;*/ 
  		/*min-height: 530px;*/ 
  		/*overflow: hidden;*/ 
  		/*margin-top: -155px;*/ 
  		} 
  	.vide-box { width: 600px; height: 530px; } 
  	.picie { float: right; width: 120px; height: 80px; } 
  	.el-dialog__footer{ width: 600px!important; height: 530px!important; padding-top: 0px!important; }
  	.pie {
	    position: relative;
	    margin: 1em auto;
	    padding: 0;
	    width: 8em;
	  	height: 8em;
	    border-radius: 50%;
	  	overflow: hidden;
	  	.slice {
		    overflow: hidden;
		    position: absolute;
		   	box-sizing: border-box;
		   	/*border: 1px solid #000000;*/
		    top: 0; 
		    right: 0;
		    width: 50%;
		  	height: 50%;
		    transform-origin: 0% 100%; 
		    color:#fff;
		    
			}
			li > span {
				position: absolute;
				top: 38%;
				left: 35%;
			}
			li:hover {
				background: rgba(0,120,153, 0.5);
				cursor: pointer;
			}
			.slice-one {
			  transform: rotate(-45deg) skewY(0deg);
			  background: #006699;
			  span{
			  	transform: rotate(45deg)
			  }
			}
			.slice-two {
			  transform: rotate(45deg) skewY(0deg);
			  background: #006699;;
			  span{
			  	transform: rotate(45deg)
			  }
			  
			}
			.slice-three {
			  transform: rotate(135deg) skewY(0deg);
			  background: #006699;
			  span{
			  	transform: rotate(45deg)
			  }
			}
			.slice-four {
			  transform: rotate(225deg) skewY(0deg);
			  background: #006699;
			  span{
			  	transform: rotate(45deg)
			  }
			}
		}
		
</style>
