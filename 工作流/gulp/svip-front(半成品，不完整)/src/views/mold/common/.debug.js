/*! <DEBUG:./paging> */
function anonymous($data,$id) {var $helpers=this,$line=0,pages=$data.pages,p=$data.p,max=$data.max,$each=$helpers.$each,val=$data.val,key=$data.key,$escape=$helpers.$escape,mid=$data.mid,ell=$data.ell,elseif=$data.elseif,$out='';try{$out+=' ';
$line=1;if(pages.length>1){
$out+=' <div class="paging"> ';
$line=3;if(p>1){
$out+=' <a id="prev" href="javascript:;">上一页</a> ';
$line=5;}
$out+=' ';
$line=6;if(pages.length<=max.length){
$out+=' ';
$line=7;$each(pages,function(val,key){
$out+=' <a class="pag';
$line=8;if(p==key){
$out+=' curr';
$line=8;}
$out+='" href="javascript:;">';
$line=8;$out+=$escape(key);
$out+='</a> ';
$line=9;});
$out+=' ';
$line=10;}else{
$out+=' ';
$line=11;if(p>=pages.length-mid){
$out+=' <a class="pag';
$line=12;if(p==1){
$out+=' curr';
$line=12;}
$out+='" href="javascript:;">1</a> <span>...</span> ';
$line=14;$each(ell,function(val,key){
$out+=' <a class="pag';
$line=15;if(pages.length-val==p){
$out+=' curr';
$line=15;}
$out+='" href="javascript:;">';
$line=15;$out+=$escape(pages.length-val);
$out+='</a> ';
$line=16;});
$out+=' ';
$line=17;$out+=$escape(elseif p<mid);
$out+=' ';
$line=18;$each(ell,function(val,key){
$out+=' <a class="pag';
$line=19;if(p==key){
$out+=' curr';
$line=19;}
$out+='" href="javascript:;">';
$line=19;$out+=$escape(key);
$out+='</a> ';
$line=20;});
$out+=' <span>...</span> <a class="pag';
$line=22;if(p==pages.length){
$out+=' curr';
$line=22;}
$out+='" href="javascript:;">';
$line=22;$out+=$escape(pages.length);
$out+='</a> ';
$line=23;}else{
$out+=' <a href="javascript:;">1</a> <span>...</span> ';
$line=26;$each(ell,function(val,key){
$out+=' <a class="pag" href="javascript:;">';
$line=27;$out+=$escape(p-val-1);
$out+='</a> ';
$line=28;});
$out+=' <a class="pag curr" href="javascript:;">';
$line=29;$out+=$escape(p);
$out+='</a> ';
$line=30;$each(ell,function(val,key){
$out+=' <a class="pag" href="javascript:;" data="';
$line=31;$out+=$escape(val);
$out+='">';
$line=31;$out+=$escape(p+val+1);
$out+='</a> ';
$line=32;});
$out+=' <span>...</span> <a class="pag';
$line=34;if(p==pages.length){
$out+=' curr';
$line=34;}
$out+='" href="javascript:;">';
$line=34;$out+=$escape(pages.length);
$out+='</a> ';
$line=35;}
$out+=' ';
$line=36;}
$out+=' ';
$line=37;if(p<pages.length){
$out+=' <a id="next" href="javascript:;">下一页</a> ';
$line=39;}
$out+=' </div> ';
$line=41;}
}catch(e){throw {id:$id,name:'Render Error',message:e.message,line:$line,source:'				{{if pages.length>1}}\r\n		            <div class="paging">\r\n		            	{{if p>1}}\r\n						<a id="prev" href="javascript:;">上一页</a>\r\n						{{/if}}\r\n						{{if pages.length<=max.length}}\r\n							{{each pages as val key}}\r\n							<a class="pag{{if p==key}} curr{{/if}}" href="javascript:;">{{key}}</a>\r\n							{{/each}}\r\n						{{else}}\r\n							{{if p>=pages.length-mid}}\r\n								<a class="pag{{if p==1}} curr{{/if}}" href="javascript:;">1</a>\r\n								<span>...</span>\r\n								{{each ell as val key}}\r\n									<a class="pag{{if pages.length-val==p}} curr{{/if}}" href="javascript:;">{{pages.length-val}}</a>\r\n								{{/each}}\r\n							{{elseif p<mid}}\r\n								{{each ell as val key}}\r\n									<a class="pag{{if p==key}} curr{{/if}}" href="javascript:;">{{key}}</a>\r\n								{{/each}}\r\n								<span>...</span>\r\n								<a class="pag{{if p==pages.length}} curr{{/if}}" href="javascript:;">{{pages.length}}</a>\r\n							{{else}}\r\n								<a href="javascript:;">1</a>\r\n								<span>...</span>\r\n								{{each ell as val key}}\r\n									<a class="pag" href="javascript:;">{{p-val-1}}</a>\r\n								{{/each}}\r\n								<a class="pag curr" href="javascript:;">{{p}}</a>\r\n								{{each ell as val key}}\r\n									<a class="pag" href="javascript:;" data="{{val}}">{{p+val+1}}</a>\r\n								{{/each}} \r\n								<span>...</span>\r\n								<a class="pag{{if p==pages.length}} curr{{/if}}" href="javascript:;">{{pages.length}}</a>\r\n							{{/if}}\r\n						{{/if}}\r\n						{{if p<pages.length}}\r\n						<a id="next" href="javascript:;">下一页</a>\r\n						{{/if}}\r\n					</div>\r\n		        {{/if}}'.split(/\n/)[$line-1].replace(/^[\s\t]+/,'')};}return new String($out);}