define(function() {
    return function tpl(str, data){
        var fn = function(d) {
            var k = [];
            var v = [];
            for (i in d) {
                k.push(i);
                v.push(d[i]);
            }
            return (new Function(k, fn.body)).apply(d, v);
        }
        if (!fn.body) {
            fn.body = 'return ';
            str = str.replace(/{(.*?)}/g, '"+$1+"');
            str = str.replace(/(^\s*|\s*$)/g, ''); // Trim white space on line start and end
            str = str.substring(2, str.length-2);
            fn.body += str;
        } 
        return data ? fn(data) : fn;
    } 
})

