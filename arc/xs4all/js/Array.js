if([].top==null) Array.prototype.top=Array_top;
if([].push==null) Array.prototype.push=Array_push;
if([].pop==null) Array.prototype.pop=Array_pop;
Array.prototype.hexJoin=Array_hexJoin;
Array.prototype.sum=Array_sum;

function Array_sum() {
  var nSum=0;
  for(var i=0; i<this.length; i++) nSum+=this[i];
  return nSum;
}
function Array_top() {
  return this[this.length-1];
}
function Array_push(o) {
  this[this.length]=o;
}
function Array_pop() {
  var o=this[this.length-1];
  this.length--;
  return o;
}
function toHex(n,digits) {
  var s='',trans='.123456789abcdef';
  if(digits==null) {
    if(n==0) s='0';
    while(n>0) {
      s=trans.substr(n&15,1)+s;
      n>>>=4;
    }
  }
  else {
    while(digits-->0) {
      s=trans.substr(n&15,1)+s;
      n>>>=4;
    }
  }
  return s;
}
function Array_hexJoin(sep,digits) {
  var a=[];
  for(var i=0; i<this.length; i++) {
    a[i]=toHex(this[i],digits);
  }
  return a.join(sep);
}

