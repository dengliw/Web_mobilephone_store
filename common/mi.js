<!--使用post的时候需配置emulateJSON，才可以在api获取到数据-->
Vue.http.options.emulateJSON = true;
// vuex
// 实例化vuex对象
// 状态管理
// store 存储
const store =	new Vuex.Store({
		state:{
			cartList:[]//是记录用户选择加入购物车的列表状态
		},
		mutations:{
			setCart(state,info){
				state.cartList.push(info)
			}
		}

	})
		 
// vue对象调用component方法
// 第一个参数：组件的名称
// 第二个参数：组件的相关配置options

Vue.component('bottomcart',{
	template:`<div class="cartBox"> <router-link to="cartpage">进入购物车</router-link>  购物车的数量 {{ totalNum }}</div>`,
	computed:{
		totalNum:function  () {
			return store.state.cartList.length
		}
	}
})



// 实例化路由对象
var router = new VueRouter({
	routes:[
		{
			path:'/',
			component:{
				template:"#buyPage",
				data(){
					return{
						goods_price:9.6,
						cur_version:[],//保存当前选中的版本
						cur_color:[],//保存当前选中的颜色
						version_data:[
						 	{
						 		id:1,
						 		name:'全网通 42G',
						 		active:true
						 	},
						 	{
						 		id:2,
						 		name:'联通12G',
						 		active:false
						 	}
						 ],
						 color_data:[
							 {
							 	id:1,
							 	name:'红色',
							 	active:true,
							 },
							 {
							 	id:2,
							 	name:'黄色',
							 	active:false,
							 }

						 ],
						 price_data:[
						 	{
						 		color_id:1,
						 		version_id:1,
						 		price:1000,
						 	},
						 	{
						 		color_id:1,
						 		version_id:2,
						 		price:2000,
						 	},
						 	{
						 		color_id:2,
						 		version_id:1,
						 		price:3000,
						 	},
						 	{
						 		color_id:2,
						 		version_id:2,
						 		price:4000,
						 	}
						 ]
					}
					
				},
				created(){
					//组件创建完成， dom还未生成
					this.cur_version=this.version_data[0]
					this.cur_color=this.color_data[0]
				},
				methods:{
					// 放多个方法的
					// 形参：形式的参数
					choise_version(cur_verinfo){
						// 找到model层的商品价格模型
						// this.goods_price =  cur_verinfo.price
						// 还需要改变选中的边框
						this.cur_version = cur_verinfo

						
						// es6 foreach 遍历数组
						// item =>  箭头函数  相当于：   function  (item) {
						// }
						this.version_data.forEach( item =>{
							item.active=false
						})

						// 把当前的版本选中为高亮
						cur_verinfo.active=true
						this.sumPrice()

						
						console.log(cur_verinfo.name)
					},
					choise_color(cur_color_info){
						// ?
						// this.goods_price =  cur_color_info.price
						this.cur_color = cur_color_info
						this.color_data.forEach( item =>{
							item.active=false
						})

						this.sumPrice()
						cur_color_info.active=true
					},
					sumPrice(){
						// 把选中的版本id和选中的颜色id，
						// 然后遍历价格数据，找到两个都匹配，然后显示价格
						this.price_data.forEach(item=>{
							if (item.color_id == this.cur_color.id && item.version_id == this.cur_version.id) {
								this.goods_price = item.price
							}
						})
						 
					},
					addCart(){
						// 也就是把当前选择的版本、颜色、价格都传给在vuex定义的设置购物车方法
						// store 是Vuex.Store返回对象
						// commit 方法是触发mutations里面定义的方法
						// 第一个参数：方法的名称
						// 第二个参数：传过去的值
						
						// 判断购物车是否已经加入 了该属性的商品
						// 如果加入了，那么只需数量+1
						
						let hasExists=false;//是否存在
						store.state.cartList.forEach(item=>{
							console.log(item)
							if (item.cur_color.id == this.cur_color.id && item.cur_version.id == this.cur_version.id) {

								hasExists=true;
								item.number++
							};
						})
						// 如果没加入，则push
						if (!hasExists) {
							store.commit('setCart',{
								cur_version:this.cur_version,
								cur_color:this.cur_color,
								number:1,
								goods_price:this.goods_price
							})
						}
					
					}
				}
			}
		},
		{
			path:'/desc',
			component:{
				template:"#desc",
				data(){
					return {

					}
				}
			}
		},
		{
			path:'/cartpage',
			component:{
				template:'#cartpage',
				computed:{
					totalPrice:function  () {
						let tPrice=0;
						this.checkGoods.forEach(item=>{
							tPrice += item.goods_price*item.number
						})

						return tPrice.toFixed(2)
					},
					totalNum:function  () {
						let tNum=0;
						this.checkGoods.forEach(item=>{
							tNum += item.number
						})

						return tNum
					}
				},
				data(){
					return{
						checkGoods:[],
						checkAllModel:false
					}
				},
				methods:{
					checkAll(){
						console.log(this.checkAllModel)
						// 如果全选为真，取消下面列表的选中
						if (this.checkAllModel) {
							this.checkGoods=[]
						}else{
							// 全部选中
							 store.state.cartList.forEach(item=>{
							 	this.checkGoods.push(item)
							 })
							 
						}
						 
					},
					addNum(info){
						// 动态数据，要在这一个商品的库存范围内
						info.number++;
					},
					jNum(info){
						if (info.number>0) {
							info.number--;
						};
					},
					delItem(index,info){
						// 删除购物车的数据
						store.state.cartList.splice(index,1)

						this.checkGoods.forEach((item,index)=>{
							// 删除选中的数据
							if (item.color_id==info.color_id && item.version_id == info.version_id) {
								this.checkGoods.splice(index,1)
							};
						})
					}
				}
			}
		},
		{
			path:'/detailes',
			component:{
				template:"#detailes",
				data(){
					return {
						curShowImg:null,
						imgData:[
							'images/index_fram_no4k.jpg',
							'images/index_fram_hdr.jpg',
						]
					}
				},
				created(){
						// 一进入页面是需要显示第一张图片
						this.curShowImg = this.imgData[0]
						// 第二步：在页面dom节点未渲染初始化动画控制js WOW
						new WOW().init()
				},
				methods:{
					showImg(info){
						this.curShowImg = this.imgData[info]
					}
				}
			}
		},
		{
			path:'/login',
			component:{
				template:'#login',
				data(){
					return {
						userName:null,//用户名
						userPwd:null,//密码
						userPwdTwo:null,//重复密码
						userErrStatus:false//控制用户名是否有错
					}
				},
				methods:{
					checkName(){
						
						if (!/^1\d{10}$/.test(this.userName)) {
							this.userErrStatus = true
							console.log('手机号码有误')
						}else{
							this.userErrStatus = false
 
						}
						
					},
					doLogin(){

							this.$http.post('http://localhost/shu/bank/user.php',{
									user_name:this.userName,
									user_pwd:this.userPwd,
							})
					}
				}
			}
		},
		{
			path:'/register',
			component:{
				template:'#register',
				data(){
					return{
						userName:null,//用户名
						userPwd:null,//密码
						userPwdTwo:null,//重复密码
						userErrStatus:false//控制用户名是否有错
					}
				},
				methods:{
					checkName(){
						// 到底是不是手机号码
						// 手机号码 11位，都是1开头，然后都是数字
						// 正则表达式 //
						//   ^1 匹配以什么开头
						//  \d 匹配一个数字
						//  {10} 匹配前面的值10次
						//  test  校验字符串是否匹配各正则表达式，如果匹配到了返回true
						// 数字
						// !false
						if (!/^1\d{10}$/.test(this.userName)) {
							this.userErrStatus = true
							console.log('手机号码有误')
						}else{
							this.userErrStatus = false

							// 把用户名、密码传给api接口
							// ajax post方法
							// 第一个参数：api接口的url
							// 第二个参数：放传给api的data数据，对象类型

							this.$http.post('/shu/bank/good/?control=user',{
							    user_name:this.userName,
								action:'checkName'
							}).then( rtnData=>{


								console.log(rtnData)
//							    rtnData.body == false
								console.log(rtnData.body.id)
							    if(rtnData.body.id){
                                	this.userErrStatus = true
								}

							})
						}
						
					},
					doReg(){

						// this.$http.get('http://localhost/shu/bank/user.php',{params:{
						// 			user_name:this.userName,
						// 			user_pwd:this.userPwd,
						// 		}

							this.$http.post('/shu/bank/good/?control=user',{
									user_name:this.userName,
									user_pwd:this.userPwd,
									action:'register'
							}).then(rtnData=>{
								if (rtnData.body.status==1) {
									this.$toast(rtnData.body.msg)
								}else{
									this.$toast(rtnData.body.msg)
								}
							})

					}
				}
			}
		}

	]

});

// router对象需注入到vue对象
	new Vue({
		el:'#vue_box',
		data:{
			
		},
		methods:{
			
		},
		store,
		router
	})