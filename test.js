var api= this.callbackToPromise || require('.')
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

let f = api(function(t,val,res,rej){
	//console.log('FromFunc',t,val,res,rej)
	if (t){
		res(val)
		} else {
		rej(val)
		}
	},[0,0,1,-1])

it('Function wrapping: test 1', function(done) {
  //define some data to compare against
  var blah = 'test1';

  //call the function we're testing
  var result = f(true,blah);

  //assertions
  result.then(function(data) {
    expect(data).to.equal(blah);
    done();
  })
  result.catch(function(error) {
    assert.fail(error);
    done();
  });
});
it('Function wrapping: test 2', function(done) {
  //define some data to compare against
  var blah = 'test2';

  //call the function we're testing
  var result = f(false,blah);

  //assertions
  result.catch(function(data) {
    expect(data).to.equal(blah);
    done();
  })
  result.then(function(error) {
    assert.fail(error);
    done();
  });
});

it('maxLength test',function(done) {
	blah = 't2'
	var pair = api.mkPair({maxLength: 1})
	pair.resolveCallback(blah)
	pair.mkPromise().then(function(data){
		expect(data).to.equal(blah);
		}).catch(function(err){assert.fail('First stage, something went REALLY wrong',err)})
	
	let err = false
	pair.resolveCallback(blah)
	try {pair.resolveCallback(blah)} catch(e) {err = true}
	if (!err){assert.fail('No error is thrown when buffer is full')}
	done()
	})
