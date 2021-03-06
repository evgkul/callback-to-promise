(function(){
let api
api = function(opts,mask){
	return api.wrapFunction.call(api,opts,mask)
	}

api.resolveMaskVariants = [1,true,'resolve','then']
api.rejectMaskVariants  = [-1,false,'reject','catch']
	
api.wrapFunction = function(opts,mask){
	let resolve = -1
	for (let i = 0;i<this.resolveMaskVariants.length && resolve==-1;i++){
		resolve = mask.indexOf(this.resolveMaskVariants[i])
		}
	let reject  = -1
	for (let i = 0;i<this.rejectMaskVariants.length && reject==-1;i++){
		reject = mask.indexOf(this.rejectMaskVariants[i])
		}
	opts = opts
	let t = typeof opts
	let func = opts
	if (t == 'string'){
		let key = opts
		func = function(){return this[key].apply(this,arguments)}
		}
	if (t == 'string' || t == 'function'){
		opts = {
			maxLength : -1,
			}
		} else {func = opts.function}
	return function(){
		let pair = api.mkPair(opts)
		let args = [];
		for (let i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}
		args[resolve] = pair.resolveCallback
		args[reject]  = pair.rejectCallback
		//console.log(args)
		let retval = func.apply(this,args)
		let prom = pair.mkPromise()
		prom.pair=pair
		prom.retval=retval
		return prom
		}
	}

api.mkCallback = function(data,key,maxLength){
	return function(){
		if (data.single){return;}
		if (data.maxLength==-1){data.single=true}
		if (data.maxLength>0 && data.queue.length>=data.maxLength){
			throw "Buffer is full!"
			//for(let i=0;i<queue.length-data.maxLength+1;i++){console.log('removing element from',queue,data); queue.shift()}
			}
		let args = [];
		for (let i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}
		if (data.acts[key]){
			let acts = data.acts
			data.acts={}
			acts[key].apply(this,args)
			} else {
				args.push(key)
				data.queue.push(args)
			}
		}
	}

api.mkPair = function(opts,obj,key,rejkey){
	opts = opts || {}
	let maxLength = opts.maxLength
	let data = {
		queue: [],
		acts: {},
		maxLength: maxLength,
		}
	let pair
	pair = function(){}
	
	pair.resolveCallback = this.mkCallback(data,'resolve',maxLength)
	pair.rejectCallback  = this.mkCallback(data,'reject',maxLength)
	pair.mkPromise = function(){
		return new Promise(function(resolve,reject){
			if (data.queue.length){
				let args = data.queue.shift()
				let act = args.pop()
				if (act=='resolve'){resolve.apply(pair,args)} else {
					reject.apply(pair,args)
					}
				} else {
					data.acts={
						resolve: resolve,
						reject:  reject
						}
					}
			})
		}
	pair._data=data
	if (obj){
		obj[key] = pair.resolveCallback
		if (rejkey){obj[rejkey] = pair.rejectCallback}
		}
	return pair
	}

if (typeof module !='undefined' && module.exports){
	module.exports=api
	} else {
		callbackToPromise = api
	}
})()
